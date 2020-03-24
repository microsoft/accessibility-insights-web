<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## Building Accessibility Insights for Android (Unified)

This document describes how to build and test the Accessibility Insights for Android (the Electron app). Much of the information/code is shared between it and Accessibility Insights for Web (the browser extension); see [Building Accessibility Insights for Web](./building-web.md) for the shared and web-specific guidance.

### "Unified"?

Throughout most of the code and build commands, Accessibility Insights for Android is referred to as "unified"; this is because we expect it may eventually serve as a client for accessibility assessments of many different platforms, not just Android. Today, Android is the only platform the "unified" app supports, and you can generally think of "unified" and "for Android" interchangeably.

### Prerequisites

All the [prerequisites](./building-web.md#Prerequisites) for building Web are also required for Unified.

#### Setting up the Android Service

Most of the functionality of Unified relies on connecting to a device running the Accessibility Insights for Android Service. However, most Unified development and testing does not require an actual Android device/VM; this repository comes with a `mock-service-for-android` that can be used to fake having one for most purposes.

If you _do_ need to work with an actual Android device/VM, you'll want to install [Android Studio](https://developer.android.com/studio/) and use it to connect to a device and/or start an emulator. You'll need to install the [Accessibility Insights for Android Service](https://github.com/microsoft/accessibility-insights-for-android-service) beforehand.

### Building

```sh
# One-time build
yarn build:unified

# Continuously rebuilds as you modify files
yarn watch:build:unified

# Build all release variants (rarely necessary, only if modifying release infrastructure)
yarn build:unified:all
```

### Running Locally

Usually, we run using a `mock-service-for-android` that runs a fake Accessibility Insights for Android Service on port 9051 for testing purposes:

```sh
# This is the command you'll want to use most of the time
yarn with:mock-service-for-android start:unified:dev

# You can leave off the with:mock-service-for-android if
# you only want to test against real devices/emulators
yarn start:unified:dev

# You can leave off the :dev if you don't want the "inspect" window
yarn start:unified
```

### Testing

**Unit tests** use exactly the same commands as in Web (`yarn test`, etc). See [Building Accessibility Insights for Web: Unit Tests](./building-web.md#unit-tests).

**End-to-end tests** for Unified are separated from Web's end-to-end tests. To run them:

```sh
# Run all unified E2E tests
yarn test:unified

# Update snapshots
yarn test:unified -u
```

### Debugging in VS Code

To debug the built app in Code, you can run the `Debug electron main process with --remote-debugging-port=9222` configuration. Once this is running, you can debug the renderer process via the `Attach debugger to electron renderer process` configuration.
