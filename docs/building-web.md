<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## Building Accessibility Insights for Web

This document describes how to build and test Accessibility Insights for Web (the browser extension). Much of the information/code is shared between it and Accessibility Insights for Android (the "unified" Electron app); for guidance specific to Unified, see [Building Accessibility Insights for Android (Unified)](./building-unified.md).

### Prerequisites

#### Tools

You will need the following tools installed:

-   [Node](https://nodejs.org) >= 14.15.0 (check by running `node --version`) - This is the version being enforced on our builds
-   [Yarn](https://yarnpkg.com/getting-started/install) >= 1.22.10 (check by running `yarn --version`)
    -    Note: There is a [known name collision](https://github.com/yarnpkg/yarn/issues/673) between Yarn package manager and Hadoop YARN. If you have Hadoop YARN installed, replace `yarn` with `yarnpkg` in the commands below.
-   **macOS only** [Xcode](https://wilsonmar.github.io/xcode/#XcodeInstall). This is needed when installing some dev dependencies (like spectron). After installing Xcode, run the following commands from a command terminal:
```
    xcode-select --install
    sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
    sudo xcodebuild -license accept
```

We recommend [VS Code](https://code.visualstudio.com/) for [editing/debugging](#using-vs-code), but you can use whichever editor you prefer. The [extensions we recommend](../.vscode/extensions.json) should be automatically suggested to you when opening this repository's folder in VS Code.

#### Fork and clone the repository

See [Git branch setup](git-branch-setup.md).

#### Install packages

```bash
yarn install
```

### Building

```sh
# One-time build
yarn build

# Continuously rebuilds as you modify non-test files
yarn watch:build:web
```

### Running Locally

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

-   Look for the ![Dev Logo](../src/icons/brand/gray/brand-gray-16px.png) extension icon to the right of the address bar

-   (Optional) run `yarn react-devtools` to open a standalone React DevTools instance that will automatically connect to any open popup or detailsView pages from a dev build of the extension.

### Testing

We use [Jest](https://github.com/facebook/jest) as our test framework, along with [typemoq](https://github.com/florinn/typemoq) and [enzyme](https://github.com/enzymejs/enzyme). We make liberal use of [Snapshot Testing](https://jestjs.io/docs/en/snapshot-testing) for unit tests of React components.

#### Unit Tests

We expect almost all code to be covered by unit tests (the main exception to this rule are "initializer" entry points that set up dependency graphs). Almost all Pull Requests should include at least some new unit tests.

```sh
# This runs only unit tests changed in your feature branch
# Run this regularly during feature development
yarn test --changedSince main

# Test only files matching a particular name pattern
yarn test -- -- SomeFile.test.tsx

# This runs unit tests continuously as they are updated
yarn watch:test

# This runs *all* unit tests; usually unnecessary, PR builds will do this
yarn test

# -u updates snapshots
yarn test --changedSince main -u
yarn test -u
yarn test -- -u -- SomeFile.test.tsx
```

Extra command line arguments and flags are passed along to Jest. See more about Jest options [here](https://jestjs.io/docs/en/cli.html).

To debug using an external tool, run `node --inspect-brk ./node_modules/jest/bin/jest.js --projects src/tests/unit --runInBand -- {RELATIVE_FILE_PATH}`. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

#### End-to-End Tests

We expect most features to have at least one major scenario covered by an end to end test, but most individual Pull Requests won't require new end-to-end tests.

We use [Playwright](https://playwright.dev) for browser automation in our end-to-end UI tests. There are some known limitations:

-   You must use a **non**-admin prompt to avoid [this issue](https://github.com/microsoft/playwright/issues/3191).
-   Headless Chromium does not support browser extensions, so our E2E tests require the ability to run a _non-headless_ Chromium process. Because of this, they are incompatible with non-graphical development environments (notably, a default WSL environment on Windows). For an example of emulating a graphical environment using `xvfb`, see [./Dockerfile](./Dockerfile). For details, see [issue #853](https://github.com/microsoft/accessibility-insights-web/issues/853).

To run the E2E tests locally:

```sh
yarn test:e2e

# -u updates snapshots
yarn test:e2e -u

# Run from the context of the docker container our Linux CI builds use (requires Docker to be installed)
yarn test:e2e:docker
```

Generally, if a Pull Request doesn't touch any E2E tests, you don't have to run them yourself; the automated Pull Request build will do it for you.

### Commands to run before check in

-   You should run a FastPass (formatting and lint checks) before creating a Pull Request to main:

    ```sh
    yarn fastpass
    ```

-   If this catches formatting or linting issues, you can fix them with a combination of:

    ```sh
    yarn fastpass:fix

    # or, in individual steps:
    yarn lint:fix
    yarn format:fix
    yarn copyright:fix
    ```

-   We normally don't run the full end to end test suite before sending a Pull Request (we let the build agents do that), but if you are working on a change where you are particularly concerned about breaking end to end tests, you can run _all_ of our Pull Request checks with:

    ```sh
    yarn assessment
    ```

### Using VS Code

To run a task from the command palette, press **Ctrl + Shift + P**, select `Tasks: Run Task`, and select the task you want to run:

-   `Test current file in VSCode` runs just the tests in the currently-opened test file

To debug a test inside VS Code, set a breakpoint and click the debug button or press **F5**.

To attach VS Code as a debugger to a separate instance of Chrome, make sure you've launched Chrome with the `--remote-debugging-port=9230` command line argument, and then use either of the `Attach debugger...` debug profiles from the VS Code Debug pane.

To debug using an external tool, run the `Debug current test file outside VS Code` task. In Chrome, for example, navigate to `chrome://inspect` and click `Open dedicated DevTools for Node`.

You can start an interactive watch session that automatically runs tests affected by uncommitted changes. To do this, run `Begin Jest watch session` from the command palette.
