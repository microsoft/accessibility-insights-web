<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

# accessibility-insights-web packages

As of Oct 2020, this repository is an ad-hoc monorepo; `/src` contains code for multiple projects,
and does not separate them as cleanly as we would like.

We plan to gradually convert the repository into a Yarn Workspaces based monorepo, similar to
how [accessibility-insights-service](https://github.com/microsoft/accessibility-insights-service) is
structured.

## Short-term (~Dec 2020) planned package layout

At minimum, we plan to use individual packages for each individually released project:

* `/packages/report`: `accessibility-insights-report` (NPM package, primarily for consumption by [accessibility-insights-service](https://github.com/microsoft/accessibility-insights-service))
* `/packages/ui`: `accessibility-insights-ui` (NPM package, primarily for consumption by [accessibilityinsights.io](https://accessibilityinsights.io))
* `/packages/unified`: Accessibility Insights for Android (Electron application)
* `/packages/web`: Accessibility Insights for Web (browser extension)

We will start out with having unified and web still combined under `/packages/web`; they will
require some work to split out.

We also plan to move end-to-end tests of packages into separate packages, to better test "true"
package API boundaries. For example:

* `/packages/report-e2e-tests`: End-to-end tests of the `report` package APIs

## Longer term (2021+) plans

Some functionality of web/unified may gradually get extracted to separate packages
for the purposes of improving build time/encapsulation; for example, some of the subdirectories
currently under `/src` might turn into separate packages one day.

Eventually, we could imagine wanting to combine `accessibility-insights-service` and
`accessibility-insights-web` into one monorepo; we aren't sure whether we necessarily want to do
this or not, but in the interest of keeping it easy, we want to lean towards using consistent
decisions between the two of them for "directory layout", "which tools run repo-wide vs
per-package", etc.

## Current (July 2021) package layout

* `/packages/ui`: current home of former `/src/packages/accessibility-insights-ui/root`
* `/packages/report`: current home of former `/src/reports/package/root`
* `/package.json`/`/src`: current home of web, unified, and most of the build rules for ui/report
