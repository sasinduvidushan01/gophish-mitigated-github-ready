# GoPhish 0.12.1 Semgrep Supply-Chain Mitigation Notes

Mitigation date: 2026-06-04

This folder is a patched working copy of the original GoPhish 0.12.1 source.
The original source and existing Windows executable were left unchanged.

## Scope

The original Semgrep report identified supply-chain findings in `go.mod` and
`yarn.lock`. The report did not identify direct application-code findings or
secrets. The mitigation therefore focuses on dependency modernization and build
metadata.

## Semgrep Rescan Follow-up

Follow-up date: 2026-06-04

A GitHub Semgrep scan of `sasinduvidushan01/gophish-mitigated-github-ready`
completed with no blocking findings, but still reported one supply-chain
finding and 17 non-blocking code findings. This follow-up addresses the
actionable items from that scan.

- Replaced archived `github.com/gorilla/csrf v1.7.3` with
  `filippo.io/csrf v0.2.1`, using the `filippo.io/csrf/gorilla` drop-in
  import path. The Go vulnerability database lists all `gorilla/csrf` versions
  as affected for CVE-2025-47909, so there is no safe `gorilla/csrf` version
  to upgrade to.
- Updated the admin CSRF test to validate the replacement package's security
  model: cross-site browser requests with an untrusted `Origin` header are
  rejected. The replacement keeps the compatibility token APIs, but enforces
  CSRF primarily through Fetch Metadata and origin checks rather than token
  comparison.
- Rendered phishing landing-page HTML through `html/template` via
  `ExecuteHTMLTemplate` so recipient-controlled values are contextually
  escaped before being written to the response.
- Added phishing redirect validation so a templated redirect cannot change the
  configured external host or scheme. Same-origin redirect paths are normalized
  before use.
- Normalized admin `next` redirects and middleware redirects through path-based
  URL construction to keep them same-origin.
- Removed direct `fmt.Fprintf` JSON response writes and now writes marshaled
  JSON bytes directly.
- Added `tls.VersionTLS13` as the minimum version for the Semgrep-reported TLS
  client configurations.
- Removed hard-coded certificate verification bypass in the site import HTTP
  client.
- Added narrow `nosemgrep` annotations only where the code now performs local
  validation/escaping or where Semgrep matched non-Django Go templates and test
  fixture HTML.

Follow-up verification:

- `go test ./...`: passed
- `go build -trimpath -o gophish-mitigated.exe .`: passed
- `gophish-mitigated.exe --version`: returned `0.12.1`
- Current executable SHA-256:
  `353DB740F9BED48CA64F15613232F48E9DADF15DEB253CA8D671436E97BEA1BC`

## Changes Made

- Upgraded reported Go dependencies:
  - `github.com/gorilla/csrf` from `v1.6.2` to `v1.7.3`
    (superseded by the follow-up replacement with `filippo.io/csrf`)
  - `github.com/sirupsen/logrus` from `v1.4.2` to `v1.9.3`
  - `golang.org/x/crypto` from a 2020 pseudo-version to `v0.45.0`
- Updated the Go directive to `go 1.24.0`.
- Ran `go mod tidy` with Go `1.24.13` to refresh `go.mod` and `go.sum`.
- Replaced the vulnerable Yarn-based frontend lockfile with an npm lockfile:
  - Removed `yarn.lock`
  - Added `package-lock.json`
  - Added `packageManager: npm@11.12.1`
- Modernized the frontend build toolchain:
  - Babel upgraded to `7.29.7`
  - Webpack upgraded to `5.107.2`
  - Webpack CLI upgraded to `7.0.3`
  - Gulp upgraded to `5.0.1`
- Replaced deprecated `gulp-uglify-es` with `gulp-terser`.
- Removed unused stale dev dependencies:
  - `clean-css`
  - `gulp-jshint`
  - `gulp-wrap`
  - `jshint`
  - `jshint-stylish`
- Added npm overrides for the Semgrep priority transitive packages:
  - `fsevents`
  - `js-yaml`
  - `kind-of`
  - `set-value`
  - `terser`
- Replaced the earlier `gorilla/csrf` plaintext HTTP context integration with
  `filippo.io/csrf/gorilla`, which does not use `PlaintextHTTPContextKey`.
- Updated controller login tests to use a real HTTP cookie jar when validating
  CSRF-protected form submissions.
- Added `build-windows.ps1` for repeatable Windows CGO test/build execution.

## Verification Completed

Run from this folder:

```powershell
npm.cmd install
npm.cmd audit --audit-level=high
npm.cmd run build
```

Results:

- `npm audit --audit-level=high`: `found 0 vulnerabilities`
- `npm run build`: completed successfully
- Webpack emitted only bundle-size warnings for `passwords.min.js` because
  `zxcvbn` is large. This is not a security failure.

The Go build and tests were completed with:

- Go `1.26.4` for Windows amd64
- CGO enabled
- MSYS2 UCRT64 MinGW-w64 GCC `15.2.0`

Results:

- `go test ./...`: passed
- `go build -trimpath -o gophish-mitigated.exe .`: passed
- `gophish-mitigated.exe --version`: returned `0.12.1`
- Executable SHA-256:
  `353DB740F9BED48CA64F15613232F48E9DADF15DEB253CA8D671436E97BEA1BC`

The SQLite C source emitted compiler warnings about possible local-variable
addresses. These warnings originate from the pinned legacy SQLite dependency;
they did not stop the build or tests.

## Windows Build Toolchain

GoPhish uses `github.com/mattn/go-sqlite3`, which is a CGO-based SQLite driver.
The verified local build toolchains are:

- Go: `C:\tmp\go1.26.4\go\bin\go.exe`
- MSYS2 GCC: `C:\tmp\msys64\ucrt64\bin\gcc.exe`

The Go archive SHA-256 matched the official Go download checksum. The MSYS2
base archive SHA-256 matched the official GitHub release digest, and GCC was
installed through MSYS2's signed `pacman` packages.

To repeat the complete test and build:

```powershell
.\build-windows.ps1
```

This laptop's PowerShell execution policy blocks unsigned scripts. The helper
script passed PowerShell syntax validation but was not executed. Do not weaken a
company execution policy to run it; have the script reviewed and signed through
the organization's normal process. The equivalent approved interactive commands
are:

```powershell
$env:PATH="C:\tmp\msys64\ucrt64\bin;C:\tmp\go1.26.4\go\bin;$env:PATH"
$env:CGO_ENABLED="1"
$env:CC="gcc"
$env:CXX="g++"
go test ./...
go build -trimpath -o gophish-mitigated.exe .
Get-FileHash -Algorithm SHA256 .\gophish-mitigated.exe
```

Use `.\build-windows.ps1 -SkipTests` only for a quick local rebuild after the
complete test suite has already passed for the exact same source.

## Operational Notes

- Do not use the old prebuilt `gophish.exe` if you want these mitigations. It
  does not include source-code or dependency changes.
- The new local executable is not Authenticode-signed. Company deployment
  should use the organization's normal code-signing and release approval
  process.
- Re-run Semgrep against this folder, not the original source folder.
- If this is used for company testing, keep deployment within written scope and
  avoid collecting real credentials or unnecessary employee personal data.
