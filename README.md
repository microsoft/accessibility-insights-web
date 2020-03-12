<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## ![Product Logo](./src/icons/brand/blue/brand-blue-48px.png) Accessibility Insights for Web & Android

[![Build Status](https://dev.azure.com/ms/accessibility-insights-web/_apis/build/status/AccessibilityInsights-Web-CI?branchName=master)](https://dev.azure.com/ms/accessibility-insights-web/_build/latest?definitionId=63&branchName=master)
[![codecov](https://codecov.io/gh/microsoft/accessibility-insights-web/branch/master/graph/badge.svg)](https://codecov.io/gh/microsoft/accessibility-insights-web)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/pbjjkligggfmakdaogkfomddhfmpjeni.svg?label=Version)](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/pbjjkligggfmakdaogkfomddhfmpjeni.svg)](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/pbjjkligggfmakdaogkfomddhfmpjeni.svg)](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni/reviews)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=microsoft/accessibility-insights-web)](https://dependabot.com)

Two projects are built from this repository:

-   Accessibility Insights for Web is a browser extension for Google Chrome and the new Microsoft Edge, used for assessing the accessibility of web sites and web applications.
-   Accessibility Insights for Android is a cross-platform desktop tool used for testing accessibility of Android applications.

### Install Accessibility Insights for Web

-   ![Canary Logo](./src/icons/brand/red/brand-red-16px.png) [Canary](https://chrome.google.com/webstore/detail/hbcplehnakffdldhldncjlnbpfgogbem) (released continuously)
-   ![Insider Logo](./src/icons/brand/violet/brand-violet-16px.png) [Insider](https://chrome.google.com/webstore/detail/nnmjfbmebeckhpejobgjjjnchlljiagp) (on feature completion)
-   ![Production Logo](./src/icons/brand/blue/brand-blue-16px.png) [Production](https://chrome.google.com/webstore/detail/pbjjkligggfmakdaogkfomddhfmpjeni) (after validation in Insider)

### Install Accessibility Insights for Android

The application also requires an APK which you can download [here](https://accessibilityinsights.io/en/downloads).

-   MacOS ([Canary](https://aka.ms/accessibility-insights-for-android/downloads/CanaryMacOS), [Insider](https://aka.ms/accessibility-insights-for-android/downloads/InsiderMacOS), [Production](https://aka.ms/accessibility-insights-for-android/downloads/MacOS))
-   Windows ([Canary](https://aka.ms/accessibility-insights-for-android/downloads/CanaryWindows), [Insider](https://aka.ms/accessibility-insights-for-android/downloads/InsiderWindows), [Production](https://aka.ms/accessibility-insights-for-android/downloads/Windows))
-   Linux ([Canary](https://aka.ms/accessibility-insights-for-android/downloads/CanaryLinux), [Insider](https://aka.ms/accessibility-insights-for-android/downloads/InsiderLinux), [Production](https://aka.ms/accessibility-insights-for-android/downloads/Linux))

### Building the code

#### Prerequisites

Please ensure that you have at least the **minimum** recommended versions

-   Node - 12.13.0 (Check by running `node --version`) - This is the version being enforced on our builds
-   Yarn - Version >= v1.17.3 (Check by running `yarn --version`)

> In case you don't have yarn, please install from: [Yarn](https://yarnpkg.com/en/docs/install)

#### 1. Fork and clone the repository

-   [Fork and clone the repository](docs/git-branch-setup.md)

#### 2. Install packages

-   Install the packages

    ```bash
    yarn install
    ```

#### 3. Build and run unit tests

-   Build and run the unit tests
    ```bash
    yarn build
    yarn test
    ```
-   Run the end-to-end tests (note: you must use a **non**-admin prompt to avoid [this issue](https://stackoverflow.com/questions/36835130))
    ```bash
    yarn test:e2e
    ```
    There are more details in the Testing section below.

#### 4. Load the extension locally

-   Build the (unpacked) extension
    ```bash
    yarn build
    ```
-   Add the extension to your browser

    -   Click on the 3-dotted-menu in the upper right corner and then select "More Tools" and then "Extensions"
    -   Verify that **developer mode** is enabled in the upper right
    -   Click on the **Load unpacked** button
    -   Choose the following directory

        `./drop/extension/dev/product/` - bundled like a production release

    > IMPORTANT: Ensure that you are testing locally before pushing a change.

-   Look for the ![Dev Logo](./src/icons/brand/gray/brand-gray-16px.png) extension icon to the right of the address bar

#### 5. Commands to run before check in

-   You should run a FastPass (formatting and lint checks) before creating a Pull Request to master:

    ```bash
    yarn fastpass
    ```

-   If this catches formatting or linting issues, you can fix them with a combination of:

    ```bash
    yarn fastpass:fix

    # or, or individual steps:
    yarn lint:fix
    yarn format:fix
    yarn copyright:fix
    ```

-   We normally don't run the full end to end test suite before sending a Pull Request (we let the build agents do that), but if you are working on a change where you are particularly concerned about breaking end to end tests, you can run _all_ of our Pull Request checks with:
    ```bash
    yarn assessment
    ```

### More Information

[Developer Workflow](./docs/workflow.md)

### Testing

We use [jest](https://github.com/facebook/jest) as our test framework and [puppeteer](https://github.com/GoogleChrome/puppeteer) for browser automation in our end-to-end UI tests.

> This project's end to end tests require the ability to run a non-headless chromium process. Because of this, they are incompatible with non-graphical development environments (notably, a default WSL environment on Windows). For an example of emulating a graphical environment using `xvfb`, see [./Dockerfile](./Dockerfile). For details, see [issue #853](https://github.com/microsoft/accessibility-insights-web/issues/853).

#### Using VS Code

To run a task from the command palette, press **Ctrl + Shift + P**, select `Tasks: Run Task`, and select the task you want to run:

-   `Test current file in VSCode` runs just the tests in the currently-opened test file

To debug a test inside VS Code, set a breakpoint and click the debug button or press **F5**.

To attach VS Code as a debugger to a separate instance of Chrome, make sure you've launched Chrome with the `--remote-debugging-port=9230` command line argument, and then use either of the `Attach debugger...` debug profiles from the VS Code Debug pane.

To debug using an external tool, run the `Debug current test file outside VS Code` task. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

You can start an interactive watch session that automatically runs tests affected by uncommitted changes. To do this, run `Begin Jest watch session` from the command palette.

#### Using the terminal

`yarn test` runs all unit tests.
`yarn test -u` runs all unit tests and updates snapshot files.

`yarn test:e2e` runs all end-to-end tests - you'll need to run `yarn build` first if you've changed non-test code.
`yarn test:e2e -u` runs all end-to-end tests and updates snapshot files.

`yarn test:e2e:docker` runs all end-to-end tests in the same Docker container our linux CI build uses. Prerequisite: [Install Docker](https://docs.docker.com/install/).

Extra command line arguments and flags are passed along to Jest. For example:

-   To run a single or small number of unit test files, run `yarn test -- -- {FILE_NAME_REGEX}`
-   `yarn watch:test` will start an interactive watch session.

See more about Jest options [here](https://jestjs.io/docs/en/cli.html).

To debug using an external tool, run `node --inspect-brk ./node_modules/jest/bin/jest.js --projects src/tests/unit --runInBand -- {RELATIVE_FILE_PATH}`. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

## Data/Telemetry

By opting into telemetry, you [help the community](https://go.microsoft.com/fwlink/?linkid=2077765) develop inclusive software. We collect anonymized data to identify the top accessibility issues found by the users. This will help focus the accessibility tools and standards community to improve guidelines, rules engines, and features.

This project collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://privacy.microsoft.com/en-us/privacystatement) to learn more.

## Reporting security vulnerabilities

If you believe you have found a security vulnerability in this project, please follow [these steps](https://technet.microsoft.com/en-us/security/ff852094.aspx) to report it. For more information on how vulnerabilities are disclosed, see [Coordinated Vulnerability Disclosure](https://technet.microsoft.com/en-us/security/dn467923).

## FAQ

Please visit our [FAQ](https://accessibilityinsights.io/docs/en/web/reference/faq) page.

## Contributing

All contributions are welcome! Please read through our guidelines on [contributions](./CONTRIBUTING.md) to this project.

## Code of Conduct

Please read through our [Code of Conduct](./CODE_OF_CONDUCT.md) to this project.
