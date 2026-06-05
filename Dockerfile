# Minify client side assets (JavaScript)
FROM node:18 AS build-js

RUN npm install gulp gulp-cli -g

WORKDIR /build
# Copy only files needed for JS/CSS build — avoids exposing secrets or binaries
COPY package.json package-lock.json gulpfile.js webpack.config.js .babelrc ./
COPY static/js/src/ ./static/js/src/
COPY static/css/ ./static/css/
RUN npm install --only=dev && \
    gulp


# Build Golang binary
FROM golang:1.15.2 AS build-golang

WORKDIR /go/src/github.com/gophish/gophish
# Copy dependency manifests first to leverage layer caching
COPY go.mod go.sum ./
RUN go mod download
# Copy Go source packages and runtime assets — excludes db files, binaries, secrets
COPY gophish.go ./
COPY auth/ ./auth/
COPY config/ ./config/
COPY context/ ./context/
COPY controllers/ ./controllers/
COPY db/ ./db/
COPY dialer/ ./dialer/
COPY imap/ ./imap/
COPY logger/ ./logger/
COPY mailer/ ./mailer/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY util/ ./util/
COPY webhook/ ./webhook/
COPY worker/ ./worker/
COPY templates/ ./templates/
COPY static/ ./static/
COPY docker/ ./docker/
COPY config.json ./
RUN go build -v


# Runtime container
FROM debian:stable-slim

RUN useradd -m -d /opt/gophish -s /bin/bash app && \
	apt-get update && \
	apt-get install --no-install-recommends -y jq libcap2-bin && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /opt/gophish
COPY --from=build-golang /go/src/github.com/gophish/gophish/ ./
COPY --from=build-js /build/static/js/dist/ ./static/js/dist/
COPY --from=build-js /build/static/css/dist/ ./static/css/dist/
COPY --from=build-golang /go/src/github.com/gophish/gophish/config.json ./
RUN chown app. config.json && \
    setcap 'cap_net_bind_service=+ep' /opt/gophish/gophish

USER app
RUN sed -i 's/127.0.0.1/0.0.0.0/g' config.json && \
    touch config.json.tmp

EXPOSE 3333 8080 8443 80

CMD ["./docker/run.sh"]
