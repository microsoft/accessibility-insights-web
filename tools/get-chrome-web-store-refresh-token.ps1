# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

<#
.SYNOPSIS
Generates a new Chrome Web Store API refresh token

.DESCRIPTION
See our internal secret rotation documentation for a step-by-step guide of how to use this script
See also https://developer.chrome.com/docs/webstore/using_webstore_api/

.EXAMPLE
./get-chrome-web-store-refresh-token.ps1 -ClientId <string> -ClientSecret <string>
#>

[CmdletBinding()]
Param(
    [Parameter(Mandatory = $true)]
    [string]$ClientId,

    [Parameter(Mandatory = $true)]
    [string]$ClientSecret
)

Set-StrictMode -Version Latest
$script:ErrorActionPreference = 'Stop'

$Hostname = 'localhost'
$Port = 8000
$Scope = 'https://www.googleapis.com/auth/chromewebstore'
$UrlEncodedRedirectUri = "http%3A//$Hostname%3A$Port"
$AuthorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth?scope=$Scope&response_type=code&redirect_uri=$UrlEncodedRedirectUri&client_id=$ClientId"

Write-Host 'Launching a browser to start the OAuth flow. Follow the prompts in the browser while logged in as our release publishing account.'
Write-Host 'If the page is not reachable, make sure you are running on a SAW VM (not a SAW Host).'
Start-Process $AuthorizationUrl

Write-Debug 'Starting an HTTP server to receive authorization code...'
$HttpListener = New-Object System.Net.HttpListener
$HttpListener.Prefixes.Add("http://$($Hostname):$Port/")
$HttpListener.Start()
try {
    $Context = $HttpListener.GetContext()
    $AuthorizationCode = [System.Web.HttpUtility]::ParseQueryString($Context.Request.Url.Query)['code']
    $ResponseBuffer = [System.Text.Encoding]::UTF8.GetBytes('Received authorization code; see console for results. You can close this tab now.')
    $Context.Response.StatusCode = 200
    $Context.Response.ContentType = 'text/plain'
    $context.Response.ContentLength64 = $ResponseBuffer.Length
    $Context.Response.OutputStream.Write($ResponseBuffer, 0, $ResponseBuffer.Length)
    $Context.Response.Close()
} finally {
    $HttpListener.Stop()
}

Write-Host 'Received OAuth Authorization Code, you can close the browser tab now.'
Write-Debug "Authorization code: $AuthorizationCode"

Write-Host 'Using code to request refresh_token...'
$Body = `
    'grant_type=authorization_code' + `
    '&code=' + $AuthorizationCode + `
    '&redirect_uri=' + $UrlEncodedRedirectUri + `
    '&client_id=' + $ClientId + `
    '&client_secret=' + $ClientSecret;
$TokenResponse = Invoke-RestMethod `
    -Uri 'https://accounts.google.com/o/oauth2/token' `
    -Method Post `
    -ContentType 'application/x-www-form-urlencoded' `
    -Body $Body;

Write-Debug "Full token response: $TokenResponse"
Write-Host "Refresh token: $($TokenResponse.refresh_token)"
