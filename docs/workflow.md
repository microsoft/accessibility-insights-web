<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

# Developer Workflow

## Automatically Build (`yarn watch`)

You can initiate a process to automatically build the extension on any source code changes and be able to see the changes in the browser. To start this run

```sh
yarn watch
```

Any time a non-test source file is changed, the build will automatically run.

## Working with the Electron app

To test the (currently experimental) Electron app form of the extension:

```sh
yarn build:electron
yarn start:electron:dev
```

Most of the functionality of the Electron app relies on connecting to a running [Axe for Android]() service.

To simulate Axe for Android (running on port 9051) for local testing of the app, use:

```sh
yarn with:mock-axe-android start:electron:dev
```
