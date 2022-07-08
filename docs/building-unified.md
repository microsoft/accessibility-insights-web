<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## Building Accessibility Insights for Android (Unified)

This document describes how to build and test Accessibility Insights for Android (the Electron app). Much of the information/code is shared between it and Accessibility Insights for Web (the browser extension); see [Building Accessibility Insights for Web](./building-web.md) for the shared and web-specific guidance.

### "Unified"?

Throughout most of the code and build commands, Accessibility Insights for Android is referred to as "unified"; this is because we expect it may eventually serve as a client for accessibility assessments of many different platforms, not just Android. Today, Android is the only platform the "unified" app supports, and you can generally think of "unified" and "for Android" interchangeably.

### Prerequisites

All the [prerequisites](./building-web.md#Prerequisites) for building Web are also required for Unified.

**Additionally**, you must [install the .NET 6.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0). Use the current LTS version. You can test whether you already have this installed by running `dotnet --list-sdks`.

Note that if you have Hadoop YARN installed, you will need to replace `yarn` with `yarnpkg` in the commands below.

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

Most of the functionality of Unified relies on connecting to a device running the Accessibility Insights for Android Service. However, most Unified development and testing does not require an actual Android device/VM; this repository includes a tool called `mock-adb` that can be used to fake having one for most purposes.

#### Using a mock device

We use a test tool called `mock-adb` to enable testing against mock devices. See the [`mock-adb` README](../packages/mock-adb/README.md) for details.

#### Connecting to a real device/emulator

If you _do_ need to work with an actual Android device/VM, you'll want to install [Android Studio](https://developer.android.com/studio/) and use it to connect to a device and/or start an emulator. The Unified app will automatically detect and install the [Accessibility Insights for Android Service](https://github.com/microsoft/accessibility-insights-for-android-service) onto your device; see [Getting Started with Accessibility Insights for Android](https://accessibilityinsights.io/docs/en/android/getstarted/setup#getting-started-with-accessibility-insights-for-android) for more info on how to prepare a device/emulator with the Accessibility Insights for Android Service.

Note: If you want to use a modified version of Accessibility Insights for Android Service, follow the [Manual installation](https://accessibilityinsights.io/docs/en/android/getstarted/setup/#manual-installation) steps. Then, make a [small modification to the Unified app](https://github.com/microsoft/accessibility-insights-web/pull/4395) to bypass the Android Service version check.  **Do not push this change.**

```sh
yarn start:unified:dev
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

### Using Chrome DevTools

To debug the renderer process, you can run the application with `yarn start:unified:dev`. This will start the dev flavor of the unified app with the environment variable 'DEV_MODE' set to 'true'. The app should open with a detached DevTools instance. See more info [here](https://www.electronjs.org/docs/tutorial/application-debugging#renderer-process). This allows you to inspect the DOM, programmatically set feature flags (e.g. `featureFlagsController.enableFeature("logTelemetryToConsole")`), or modify persisted data in the Application tab. You can set this environment variable user/system-wide if needed for non-dev-flavor workflows.
