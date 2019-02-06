<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

# Accessibility Insights for Web

![Product Logo](./src/icons/brand/blue/brand-blue-128px.png)

Accessibility Insights for Web is a Google Chrome extension for assessing the accessibility of web sites and web applications.

## Running the extension

You can install the extension from one of the following links

-   ![Daily Logo](./src/icons/brand/red/brand-red-16px.png) [Daily](https://chrome.google.com/webstore/detail/hbcplehnakffdldhldncjlnbpfgogbem) (released continuously)
-   ![Staging Logo](./src/icons/brand/violet/brand-violet-16px.png) [Staging](https://chrome.google.com/webstore/detail/nnmjfbmebeckhpejobgjjjnchlljiagp) (on feature completion)
-   ![Production Logo](./src/icons/brand/blue/brand-blue-16px.png) [Production](https://chrome.google.com/webstore/detail/pbjjkligggfmakdaogkfomddhfmpjeni) (after validation in staging)

## Building the code

### 1. Clone the repository

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

### 2. Install packages

-   Install the packages
    ```bash
    npm install
    ```

### 3. Build and run unit tests

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

### 4. Load the extension locally

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

### 5. Commands to run before check in

-   Run the below command to build, test, check if files have copyright header, check file format styling & tslint issues
    ```bash
    npm run precheckin
    ```
-   If the above command failed for formatting issues, run the below command to format all files
    ```bash
    npm run format
    ```

## More Information

[Developer Workflow](./docs/workflow.md)

## Testing

We use [jest](https://github.com/facebook/jest) as our test framework and [puppeteer](https://github.com/GoogleChrome/puppeteer) for browser automation in our end-to-end UI tests.

### Using VS Code

To run a task from the command palette, press **Ctrl + Shift + P**, select `Tasks: Run Task`, and select the task you want to run:

-   `npm: test` runs all unit tests
-   `Test current file in VSCode` runs just the tests in the currently-opened test file
-   `npm: test:e2e` runs all end-to-end tests

To debug inside VS Code, set a breakpoint and click the debug button or press **F5**.

To debug using an external tool, run the `Debug current test file outside VS Code` task. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

You can start an interactive watch session that automatically runs tests affected by uncommitted changes. To do this, run `Begin Jest watch session` from the command palette.

### Using the terminal

`npm test` runs all unit tests.
`npm test -- -u` runs all unit tests and updates snapshot files.

`npm run test:e2e` runs all end-to-end tests - you'll need to run `npm run build` first if you've changed non-test code.
`npm run test:e2e -- -u` runs all end-to-end tests and updates snapshot files.

To run a single or small number of test files, run `npm test -- {FILE_NAME_REGEX}`

Options after the `--` are passed to Jest. For example, `npm test -- --watch` will start an interactive watch session. See more about Jest options [here](https://jestjs.io/docs/en/cli.html).

To debug using an external tool, run `node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand {RELATIVE_FILE_PATH}`. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
