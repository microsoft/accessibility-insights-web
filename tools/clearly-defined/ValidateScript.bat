:: Copyright (c) Microsoft Corporation. All rights reserved.
:: Licensed under the MIT License.

@echo off
:: Validator for check-clearly-defined.ps1
::
:: Executes check-clearly-defined.ps1 in various scenarios to check script correctness

setlocal
cls

@echo Skipped case: Non-dependabot branch
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName fix-bug
pwsh -f ./check-clearly-defined.ps1 -PipelineType ado -BranchName fix-bug
if errorlevel 1 goto fail
echo OK
echo.

@echo Passing case: Docker playwright image
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/docker/playwright-v1.37.1-focal
pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/docker/playwright-v1.37.1-focal
if errorlevel 1 goto fail
echo OK
echo.

echo Passing case: ADO PR build of dependabot branch
echo set SYSTEM_PULLREQUEST_SOURCEBRANCH=dependabot/nuget/src/Moq-4.18.4
set SYSTEM_PULLREQUEST_SOURCEBRANCH=dependabot/nuget/src/Moq-4.18.4
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType ado
pwsh -f ./check-clearly-defined.ps1 -PipelineType ado
if errorlevel 1 goto fail
echo OK
echo.

@echo Passing case: ADO non-PR build of dependabot branch
set SYSTEM_PULLREQUEST_SOURCEBRANCH=
set BUILD_SOURCEBRANCH=refs/heads/dependabot/nuget/src/Axe.Windows-2.1.3
echo set BUILD_SOURCEBRANCH=refs/heads/dependabot/nuget/src/Axe.Windows-2.1.3
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType ado
pwsh -f ./check-clearly-defined.ps1 -PipelineType ado
if errorlevel 1 goto fail
echo OK
echo.

@echo Passing case: action PR build of dependabot branch without namespace
set BUILD_SOURCEBRANCH=
set GITHUB_HEAD_REF=dependabot/npm_and_yarn/eslint-config-prettier-8.9.0
echo set GITHUB_HEAD_REF=dependabot/npm_and_yarn/eslint-config-prettier-8.9.0
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType action
pwsh -f ./check-clearly-defined.ps1 -PipelineType action
if errorlevel 1 goto fail
echo OK
echo.

@echo Passing case: action PR build of dependabot branch with namespace
set BUILD_SOURCEBRANCH=
set GITHUB_HEAD_REF=dependabot/npm_and_yarn/typescript-eslint/eslint-plugin-6.3.0
echo set GITHUB_HEAD_REF=dependabot/npm_and_yarn/typescript-eslint/eslint-plugin-6.3.0
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType action
pwsh -f ./check-clearly-defined.ps1 -PipelineType action
if errorlevel 1 goto fail
echo OK
echo.

@echo Passing case: local PR build of dependabot branch with github_actions type
set BUILD_SOURCEBRANCH=
set GITHUB_HEAD_REF=
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/github_actions/actions/checkout-1.2.3
pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/github_actions/actions/checkout-1.2.3
if errorlevel 1 goto fail
echo OK
echo.

@echo Passing case: local PR build of dependabot branch with @types namespace
set BUILD_SOURCEBRANCH=
set GITHUB_HEAD_REF=
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/npm_and_yarn/types/jest-1.10000.1
pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/npm_and_yarn/types/jest-1.10000.1
if errorlevel 1 goto fail
echo OK
echo.

@echo Failing case: Package that does not exist in ClearlyDefined
echo pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/nuget/src/Axe.Windows-2.99.99
pwsh -f ./check-clearly-defined.ps1 -PipelineType local -BranchName dependabot/nuget/src/Axe.Windows-2.99.99
if errorlevel 2 goto succeeded
goto fail

:succeeded
echo OK
echo.
echo ALL TESTS ARE OK :)
goto :eof

:fail
echo TEST FAILED -- PLEASE DEBUG THE SCRIPT!
