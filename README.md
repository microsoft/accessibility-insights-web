<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## ![Product Logo](./src/icons/brand/blue/brand-blue-48px.png) Accessibility Insights for Web

[![Build Status](https://dev.azure.com/ms/accessibility-insights-web/_apis/build/status/AccessibilityInsights-Web-CI?branchName=master)](https://dev.azure.com/ms/accessibility-insights-web/_build/latest?definitionId=63&branchName=master)
[![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/ms/accessibility-insights-web/63.svg)](https://dev.azure.com/ms/accessibility-insights-web/_build?definitionId=63&_a=summary)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/pbjjkligggfmakdaogkfomddhfmpjeni.svg?label=Version)](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/pbjjkligggfmakdaogkfomddhfmpjeni.svg)](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/pbjjkligggfmakdaogkfomddhfmpjeni.svg)](https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni/reviews)

Accessibility Insights for Web is a Google Chrome extension for assessing the accessibility of web sites and web applications.

### Running the extension

You can install the extension from one of the following links

-   ![Canary Logo](./src/icons/brand/red/brand-red-16px.png) [Canary](https://chrome.google.com/webstore/detail/hbcplehnakffdldhldncjlnbpfgogbem) (released continuously)
-   ![Insider Logo](./src/icons/brand/violet/brand-violet-16px.png) [Insider](https://chrome.google.com/webstore/detail/nnmjfbmebeckhpejobgjjjnchlljiagp) (on feature completion)
-   ![Production Logo](./src/icons/brand/blue/brand-blue-16px.png) [Production](https://chrome.google.com/webstore/detail/pbjjkligggfmakdaogkfomddhfmpjeni) (after validation in Insider)

### Building the code

#### Prerequisites

Please ensure that you have at least the minimum recommended versions

-   Node - 10.15.0 (Check by running `node --version`)
-   NPM - 6.4.1 (Check by running `npm --version`)

#### 1. Clone the repository

-   Clone the repository using one of the following commands
    ```bash
    git clone https://github.com/Microsoft/accessibility-insights-web.git
    ```
    or
    ```bash
    git clone git@github.com:Microsoft/accessibility-insights-web.git
    ```
-   Select the created directory
    ```bash
    cd accessibility-insights-web
    ```

#### 2. Install packages

-   Install the packages
    ```bash
    npm install
    ```

#### 3. Build and run unit tests

-   Run the unit tests
    ```bash
    npm test
    ```
-   Build and run the end-to-end tests (note: you must use a **non**-admin prompt to avoid [this issue](https://stackoverflow.com/questions/36835130))
    ```bash
    npm run build
    npm run test:e2e
    ```
    There are more details in the Testing section below.

#### 4. Load the extension locally

-   Build the (unpacked) extension
    ```bash
    npm run build
    ```
-   Add the extension to your Chrome browser

    -   Click on the 3-dotted-menu in the upper right corner and then select "More Tools" and then "Extensions"
    -   Verify that **developer mode** is enabled in the upper right
    -   Click on the **Load unpacked** button
    -   Choose the following directory

        `./drop/dev/extension/` - bundled like a production release

    > IMPORTANT: Ensure that you are testing locally before pushing a change.

-   Look for the ![Dev Logo](./src/icons/brand/gray/brand-gray-16px.png) extension icon to the right of the address bar

#### 5. Commands to run before check in

-   Run the below command to build, test, check if files have copyright header, check file format styling & tslint issues
    ```bash
    npm run precheckin
    ```
-   If the above command failed for formatting issues, run the below command to format all files
    ```bash
    npm run format
    ```

### More Information

[Developer Workflow](./docs/workflow.md)

### Testing

We use [jest](https://github.com/facebook/jest) as our test framework and [puppeteer](https://github.com/GoogleChrome/puppeteer) for browser automation in our end-to-end UI tests.

#### Using VS Code

To run a task from the command palette, press **Ctrl + Shift + P**, select `Tasks: Run Task`, and select the task you want to run:

-   `npm: test` runs all unit tests
-   `Test current file in VSCode` runs just the tests in the currently-opened test file
-   `npm: test:e2e` runs all end-to-end tests

To debug a test inside VS Code, set a breakpoint and click the debug button or press **F5**.

To attach VS Code as a debugger to a separate instance of Chrome, make sure you've launched Chrome with the `--remote-debugging-port=9230` command line argument, and then use either of the `Attach debugger...` debug profiles from the VS Code Debug pane.

To debug using an external tool, run the `Debug current test file outside VS Code` task. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

You can start an interactive watch session that automatically runs tests affected by uncommitted changes. To do this, run `Begin Jest watch session` from the command palette.

#### Using the terminal

`npm test` runs all unit tests.
`npm test -- -u` runs all unit tests and updates snapshot files.

`npm run test:e2e` runs all end-to-end tests - you'll need to run `npm run build` first if you've changed non-test code.
`npm run test:e2e -- -u` runs all end-to-end tests and updates snapshot files.

To run a single or small number of test files, run `npm test -- {FILE_NAME_REGEX}`

Options after the `--` are passed to Jest. For example, `npm test -- --watch` will start an interactive watch session. See more about Jest options [here](https://jestjs.io/docs/en/cli.html).

To debug using an external tool, run `node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand {RELATIVE_FILE_PATH}`. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

## Data/Telemetry

By opting into telemetry, you [help the community](https://go.microsoft.com/fwlink/?linkid=2077765) develop inclusive software. We collect anonymized data to identify the top accessibility issues found by the users. This will help focus the accessibility tools and standards community to improve guidelines, rules engines, and features.

This project collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://privacy.microsoft.com/en-us/privacystatement) to learn more.

## Reporting security vulnerabilities

If you believe you have found a security vulnerability in this project, please follow [these steps](https://technet.microsoft.com/en-us/security/ff852094.aspx) to report it. For more information on how vulnerabilities are disclosed, see [Coordinated Vulnerability Disclosure](https://technet.microsoft.com/en-us/security/dn467923).

## FAQ

Please visit our [FAQ](./FAQ.md) page.

## Contributing

All contributions are welcome! Please read through our guidelines on [contributions](./CONTRIBUTING.md) to this project.

## Code of Conduct

Please read through our [Code of Conduct](./CODE_OF_CONDUCT.md) to this project.
