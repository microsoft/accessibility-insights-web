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
./check-clearly-defined.ps1 -BranchName <string> [-PipelineType <string>]
#>

[CmdletBinding()]
Param(
    [Parameter(Mandatory = $true)]
    [string]$BranchName,
    [Parameter(Mandatory = $false)]
    [string]$PipelineType
)

Set-StrictMode -Version Latest
$script:ErrorActionPreference = 'Stop'

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
    Write-Verbose "Branch name: $branchName"
    
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

function WriteFormattedError([string]$formatter, [string]$message) {
    switch ($formatter) {
        "ado" {
            Write-Host "##vso[task.logissue type=error]$message"
        }
        "action" {
            Write-Host "::error::$message"
        }
        default {
            Write-Host $message
        }
    }
}

try {
    $uri = GetUri($BranchName)
    Write-Host $uri
    $response = Invoke-RestMethod -Uri $uri -Method Get -ErrorAction Stop

    if(Get-Member -inputobject $response -name "files" -Membertype Properties) {
        Write-Host "ClearlyDefined has a definition for this package version."
        Exit 0
    }
}
catch {
    WriteFormattedError $PipelineType "Caught error: $Error"
    Exit 1
}

WriteFormattedError $PipelineType "ClearlyDefined does not have a definition for this package version.
If this is a development component, you may safely ignore this error.

If this is a production component, please do the following:
1. Request that ClearlyDefined harvest information for this package version
2. Wait for the harvest to complete (check at https://clearlydefined.io)
3. Re-run the failed build
4. Once the PR build passes, merge the PR"
    
Exit 2
