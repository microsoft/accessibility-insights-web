<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

# accessibility-insights-web packages

As of writing, this repository is an ad-hoc monorepo; `/src` contains code for multiple projects,
and does not separate them as cleanly as we would like.

We plan to gradually convert the repository into a Lerna/Yarn Workspaces based monorepo, similar to
how [accessibility-insights-service](https://github.com/microsoft/accessibility-insights-service) is
structured.

## Planned package layout

At minimum, we plan to use individual packages for each individually released project:

* `/packages/report`: `accessibility-insights-report` (NPM package, primarily for consumption by [accessibility-insights-service](https://github.com/microsoft/accessibility-insights-service))
* `/packages/ui`: `accessibility-insights-ui` (NPM package, primarily for consumption by [accessibilityinsights.io](https://accessibilityinsights.io))
* `/packages/unified`: Accessibility Insights for Android (Electron application)
* `/packages/web`: Accessibility Insights for Web (browser extension)

We also plan to move end-to-end tests of packages into separate packages, to better test "true"
package API boundaries. For example:

* `/packages/report-e2e-tests`: End-to-end tests of the `report` package APIs

Beyond these, some functionality of web/unified may gradually get extracted to separate packages
for the purposes of improving build time/encapsulation; for example, some of the subdirectories
currently under `/src` might turn into separate packages one day.

## Current package layout

* `/src/packages/accessibility-insights-ui/root`: current home of future `/packages/ui`
* `/src/reports/package/root`: current home of future `/packages/report`
* `/package.json`/`/src`: current home of web, unified, and most of the build rules for ui/report
