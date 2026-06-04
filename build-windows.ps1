[CmdletBinding()]
param(
    [string]$Output = "gophish-mitigated.exe",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

function Find-Executable {
    param(
        [string]$Name,
        [string[]]$FallbackPaths
    )

    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    foreach ($path in $FallbackPaths) {
        if (Test-Path -LiteralPath $path) {
            return $path
        }
    }

    throw "Unable to find $Name. Install it or add it to PATH."
}

$go = Find-Executable "go" @(
    "C:\tmp\go1.26.4\go\bin\go.exe",
    "C:\Program Files\Go\bin\go.exe"
)
$gcc = Find-Executable "gcc" @(
    "C:\tmp\msys64\ucrt64\bin\gcc.exe",
    "C:\msys64\ucrt64\bin\gcc.exe"
)

$gccBin = Split-Path -Parent $gcc
$goBin = Split-Path -Parent $go
$env:PATH = "$gccBin;$goBin;$env:PATH"
$env:CGO_ENABLED = "1"
$env:CC = "gcc"
$env:CXX = "g++"

Push-Location $PSScriptRoot
try {
    & $go version
    & $gcc --version | Select-Object -First 1

    if (-not $SkipTests) {
        & $go test ./...
        if ($LASTEXITCODE -ne 0) {
            throw "Go test suite failed."
        }
    }

    & $go build -trimpath -o $Output .
    if ($LASTEXITCODE -ne 0) {
        throw "Go build failed."
    }

    Get-Item -LiteralPath $Output | Select-Object FullName, Length, LastWriteTime
    Get-FileHash -Algorithm SHA256 -LiteralPath $Output
}
finally {
    Pop-Location
}
