<!--
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the MIT License.
-->

## mock-adb

This directory contains the implementation for a `mock-adb` (Android Debug Bridge) executable. The unified product leverages `adb` to setup a test Android device. We use `mock-adb` in two ways:
* during end-to-end tests that exercise the Android setup process
* during development if you prefer to use a mock device/emulator

### Usage

Note that if you have Hadoop YARN installed, you will need to replace `yarn` with `yarnpkg` in the commands below.

```sh
# This sets up mock-adb to respond as if a single physical device is connected with a working
# and current install of Accessibility Insights for Android Service.
yarn mock-adb single-device

# Start the app like normal. During the "connect a device" flow where it asks you where to find
# ADB, use the path C:\path\to\repo\drop\mock-adb - this folder should have been produced already
# as part of yarn build:unified, but you can rebuild it with yarn build:mock-adb if necessary.
yarn start:unified

# Alternatively, this script sets the env-var ANDROID_HOME to point at drop\mock-adb\ when
# running the app. You can also delete the stored adb location in the Application tab of devtools.
yarn start:unified:mock-adb
```

### Debugging issues with mock-adb

You can find `mock-adb` logs in `drop\mock-adb\logs`. Each folder contains two files:
* `mock_adb_config.json` - the configuration used by `mock-adb` to control its behavior
* `mock_adb_output.json` - the input and output for each invocation of `mock-adb`

In the remote build, these logs are uploaded as artifacts if any end-to-end tests fail.

### Implementation

The `mock-adb` implementation is in [bin.js](./app/bin.js). Commands such as `yarn mock-adb` and end-to-end tests call [setupMockAdb](https://github.com/microsoft/accessibility-insights-web/blob/main/src/tests/miscellaneous/mock-adb/setup-mock-adb.js#L28) to write the appropriate config/logging context to disk. `bin.js` gets packaged into an executable that reads the context from disk and runs with the configured behavior.
