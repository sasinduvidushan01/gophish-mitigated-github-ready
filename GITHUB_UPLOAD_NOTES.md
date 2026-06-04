# GitHub Upload Notes

This folder is a clean GitHub-ready copy of the mitigated GoPhish source.

## Folder Purpose

Use this folder for the new private GitHub repository and Semgrep rescan:

```text
gophish-mitigated-github-ready
```

The tested working source remains in:

```text
gophish-0.12.1-mitigated
```

## Included

- GoPhish source code and templates
- `go.mod` and `go.sum`
- `package.json` and `package-lock.json`
- `MITIGATION_NOTES.md`
- `build-windows.ps1`
- `.github/workflows/semgrep.yml`
- License, README, Docker, and supporting project files

## Excluded

The following local/runtime files were intentionally not copied:

- `gophish-mitigated.exe`
- `gophish.exe`
- `gophish.db`
- `gophish_admin.key`
- `gophish_admin.crt`
- `node_modules`
- Go build/cache folders

Do not upload employee lists, SMTP passwords, API keys, real campaign data, or
private certificates/keys.

## Create New Private Repository

Run these commands from this folder after the company/private GitHub repository
has been created:

```powershell
git init
git branch -M main
git add .
git commit -m "Add mitigated GoPhish source for Semgrep validation"
git remote add origin https://github.com/YOUR-COMPANY/gophish-mitigated-security-training.git
git push -u origin main
```

## Semgrep

The included GitHub Actions workflow uses:

```text
semgrep ci --supply-chain
```

Add `SEMGREP_APP_TOKEN` in GitHub before running the workflow:

```text
Repository Settings > Secrets and variables > Actions > New repository secret
```

Then run the workflow manually from GitHub Actions or push to `main`.
