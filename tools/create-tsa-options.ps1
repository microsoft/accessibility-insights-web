# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.
<#
.SYNOPSIS
Create the config\tsaoptions.json file based on the parameters. Parameters will be stored as pipeline variables for confidentiality reasons.
.PARAMETER InstanceUrl
The Url to the TSA instance of the database
.PARAMETER ProjectName
The name of the TSA project
.PARAMETER CodeBaseAdmins
The admin[s] of the TSA database, as a semicolon delimited list
.PARAMETER AreaPath
The Area Path that will be attached to new TSA work items
.PARAMETER IterationPath
The iteration path that will be attached to new TSA work items
.PARAMETER NotificationAliases
The email alias[es] that will be used for TSA notifications, as a semicolon delimited list
.PARAMETER Tools
The tool[s] for which uploads are expected, as a semicolon delimited list
.PARAMETER OutputFile
The fully qualified path to the output file. Assumes that the folder already exists
.EXAMPLE
PS> .\create-tsa-options.ps1 `
        -InstanceUrl "MyInstanceUrl" `
        -ProjectName "MyProject" `
        -CodeBaseAdmins "Domain/user1;Domain/user2" `
        -AreaPath "MyAreaPath" `
        -IterationPath "MyIterationPath" `
        -NotificationAliases "MyTeam@MyCompany.com" `
        -Tools "CredScan;PoliCheck" `
        -OutputFile ".\config\tsaoptions.json"
#>

param(
    [Parameter(Mandatory=$true)][string]$InstanceUrl,
    [Parameter(Mandatory=$true)][string]$ProjectName,
    [Parameter(Mandatory=$true)][string]$CodeBaseAdmins,
    [Parameter(Mandatory=$true)][string]$AreaPath,
    [Parameter(Mandatory=$true)][string]$IterationPath,
    [Parameter(Mandatory=$true)][string]$NotificationAliases,
    [Parameter(Mandatory=$true)][string]$Tools,
    [Parameter(Mandatory=$true)][string]$OutputFile
)

Set-StrictMode -Version Latest
$script:ErrorActionPreference = 'Stop'

$DirName = Split-Path -parent $OutputFile

If(!(Test-path $DirName))
{
    New-Item -ItemType Directory -Path $DirName
}

# Uncomment the next line for debugging
$VerbosePreference='continue'

function Get-ItemsFromSemicolonSeparatedList([string]$inputList)
{
    $test = @($inputList.Split(";"))
    return $test
}

function Get-ConfigObject([string]$codeBaseAdmins,[string]$notificationAliases,[string]$instanceUrl,[string]$projectName,[string]$areaPath,[string]$iterationPath,[string]$tools)
{
    $notificationAliasesArray = @(Get-ItemsFromSemicolonSeparatedList $notificationAliases)
    $codebaseAdminsArray = @(Get-ItemsFromSemicolonSeparatedList $codeBaseAdmins)
    $toolsArray = @(Get-ItemsFromSemicolonSeparatedList $tools) 

    $config = @{}
    $config | Add-Member -Name "codebaseName"        -Type NoteProperty "accessibility-insights-web"
    $config | Add-Member -Name "repositoryName"      -Type NoteProperty "accessibility-insights-web"
    $config | Add-Member -Name "tsaVersion"          -Type NoteProperty "TsaV2"
    $config | Add-Member -Name "codebase"            -Type NoteProperty "NewOrUpdate"
    $config | Add-Member -Name "tsaStamp"            -Type NoteProperty "DevDiv"
    $config | Add-Member -Name "tsaEnvironment"      -Type NoteProperty "Prod"
    $config | Add-Member -Name "template"            -Type NoteProperty "TFSPowerBI"
    $config | Add-Member -Name "instanceUrl"         -Type NoteProperty $instanceUrl
    $config | Add-Member -Name "projectName"         -Type NoteProperty $projectName
    $config | Add-Member -Name "areaPath"            -Type NoteProperty $areaPath
    $config | Add-Member -Name "iterationPath"       -Type NoteProperty $iterationPath
    $config | Add-Member -Name "notificationAliases" -Type NoteProperty $notificationAliasesArray
    $config | Add-Member -Name "codebaseAdmins"      -Type NoteProperty $codebaseAdminsArray
    $config | Add-Member -Name "tools"               -Type NoteProperty $toolsArray

    return $config
}

$config = Get-ConfigObject $CodeBaseAdmins $NotificationAliases $InstanceUrl $ProjectName $AreaPath $IterationPath $Tools

$config | ConvertTo-Json | Out-File $OutputFile -Encoding "utf8"

Write-Host "Output to ${OutputFile}:"
Get-Content $OutputFile | Write-Host
