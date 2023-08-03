# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

<#
.SYNOPSIS
Determine if this is a dependabot PR, then check if the new version is in ClearlyDefined

.DESCRIPTION
ClearlyDefined is our source of license information for dependemncies, but it often lags behind
the latest version of a package. This script exists to detect this scenario and to serve as a
reminder to request that ClearlyDefined harvest information for the version being updated.

.EXAMPLE
./check-clearly-defined.ps1 -PipelineType <string> [-BranchName <string>]
#>

[CmdletBinding()]
Param(
    [Parameter(Mandatory = $true)]
    [string]$PipelineType,
    [Parameter(Mandatory = $false)]
    [string]$BranchName
)

Set-StrictMode -Version Latest
$script:ErrorActionPreference = 'Stop'

function GetPipelineType([string]$pipelineType) {
    $trimmedType = $pipelineType.Trim()
    switch ($trimmedType) {
        "action" {
            return $trimmedType
        }
        "ado" {
            return $trimmedType
        }
        "local" {
            return $trimmedType
        }
    }

    Throw "Pipeline type not provided or invalid"
}

function GetBranchName([string]$pipelineType, [string]$branchName) {
    $trimmedBranchName = $branchName.Trim()
    Write-Verbose "Trimmed branch name: $trimmedBranchName"

    if ($trimmedBranchName.Length -eq 0) {
        switch ($pipelineType) {
            "action" {
                Write-Verbose "Using GITHUB environment variable"
                $trimmedBranchName = ($Env:GITHUB_HEAD_REF).Trim()
            }
            "ado" {
                Write-Verbose "Using ADO environment variable"
                $trimmedBranchName = ($Env:SYSTEM_PULLREQUEST_SOURCEBRANCH).Trim()
            }
            "local" {
                Write-Verbose "Using parameter environment variable"
                $trimmedBranchName = ""
            }
        }
    }

    if ($trimmedBranchName.Length -eq 0) {
        Throw "Branch name not provided or invalid"
    }

    return $trimmedBranchName
}

function GetType([string]$rawType) {
    if ($rawType -eq "npm_and_yarn") {
        return "npm"
    }

    return $rawType
}
function GetProvider([string]$rawType) {
    if ($rawType -eq "npm_and_yarn") {
        return "npmjs"
    }

    return $rawType
}

function GetUri([string]$branchName){
    $elements = $BranchName.Split('/')

    if ($elements[0] -ne 'dependabot') {
        Write-Host "Not a dependabot PR, skipping check"
        Exit 0
    }

    $type = GetType $elements[1]
    $provider = GetProvider $elements[1]
    if ($elements.Length -eq 3) {
        $namespace = "-"
        $fullPackage = $elements[2]
    } else {
        $namespace = $elements[2]
        $fullPackage = $elements[3]
    }

    $splitPackage = $fullPackage.Split('-')
    $packageName = $splitPackage[0]
    $packageVersion = $splitPackage[1]

    return "https://api.clearlydefined.io/definitions/$type/$provider/$namespace/$packageName/$packageVersion"
}

function WriteFormattedError([string]$pipelineType, [string]$message) {
    switch ($pipelineType) {
        "action" {
            Write-Host "::error::$message"
        }
        "ado" {
            Write-Host "##vso[task.logissue type=error]$message"
        }
        default {
            Write-Host $message
        }
    }
}

try {
    $pipelineType = GetPipelineType $PipelineType
    $branchName = GetBranchName $pipelineType $BranchName

    Write-Verbose "Resolved Inputs: BranchName=$branchName, PipeLineType=$pipelineType"

    $uri = GetUri($branchName)
    Write-Host "Getting date from $uri"
    $response = Invoke-RestMethod -Uri $uri -Method Get -ErrorAction Stop

    if(Get-Member -inputobject $response -name "files" -Membertype Properties) {
        Write-Host "ClearlyDefined has a definition for this package version."
        Exit 0
    }
}
catch {
    WriteFormattedError $pipelineType "Caught error: $Error"
    Exit 1
}

WriteFormattedError $pipelineType "ClearlyDefined does not have a definition for this package version.
If this is a development component, you may safely ignore this error.

If this is a production component, please do the following:
1. Request that ClearlyDefined harvest information for this package version
2. Wait for the harvest to complete (check at https://clearlydefined.io)
3. Re-run the failed build
4. Once the PR build passes, merge the PR"
    
Exit 2
