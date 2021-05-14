// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const { apkVersionName } = require('accessibility-insights-for-android-service-bin');
const cloneDeep = require('lodash/cloneDeep');

const successfulTestServerContentPath = path.join(
    __dirname,
    '../mock-service-for-android/AccessibilityInsights',
);

const devicesCommandMatch = 'devices';
const serviceInfoCommandMatch =
    'shell dumpsys package com.microsoft.accessibilityinsightsforandroidservice';
const serviceIsRunningCommandMatch = 'shell dumpsys accessibility';
const portForwardingCommandMatch = 'forward tcp:';
const sdkVersionCommandMatch = 'shell getprop ro.build.version.sdk';
const inputKeyeventCommandMatch = 'shell input keyevent';
const resetOverlayPermissionCommandMatch =
    'shell cmd appops reset com.microsoft.accessibilityinsightsforandroidservice';
const grantOverlayPermissionCommandMatch =
    'shell pm grant com.microsoft.accessibilityinsightsforandroidservice android.permission.SYSTEM_ALERT_WINDOW';

function addDeviceEnumerationCommands(id, output) {
    output[`-s ${id} ${devicesCommandMatch}`] = cloneDeep(output.devices);
}

function addDeviceDetailCommands(id, output) {
    // These commands appear in the order that they get called by appium-adb
    output[`-s ${id} shell getprop ro.product.model`] = {
        stdout: `working mock device (${id})`,
    };
}

function addDetectServiceCommands(id, output) {
    // These commands appear in the order that they get called by appium-adb
    output[`-s ${id} ${serviceInfoCommandMatch}`] = {
        stdout: `    versionCode=102000 minSdk=24 targetSdk=28\n    versionName=${apkVersionName}`,
    };
}

function addCheckPermissionsCommands(id, output) {
    // These commands appear in the order that they get called by appium-adb
    output[`-s ${id} ${serviceIsRunningCommandMatch}`] = {
        stdout: '                     Service[label=Accessibility Insights for…, feedbackType[FEEDBACK_SPOKEN, FEEDBACK_HAPTIC, FEEDBACK_AUDIBLE, FEEDBACK_VISUAL, FEEDBACK_GENERIC, FEEDBACK_BRAILLE], capabilities=1, eventTypes=TYPES_ALL_MASK, notificationTimeout=0]}',
    };
    output[`-s ${id} shell dumpsys media_projection`] = {
        stdout: '(com.microsoft.accessibilityinsightsforandroidservice, uid=12354): TYPE_SCREEN_CAPTURE',
    };
}

function addInstallServiceCommands(id, output) {
    // These commands appear in the order that they get called by appium-adb
    output[`-s ${id} ${sdkVersionCommandMatch}`] = {
        stdout: '29',
    };
    output[`-s ${id} shell getprop ro.build.version.release`] = {
        stdout: '10',
    };
    output[`-s ${id} help`] = {
        stdout: '--streaming: force streaming APK directly into Package Manager',
    };
    output[`-s ${id} features`] = {
        stdout: 'abb_exec\nfixed_push_symlink_timestamp\nabb\nstat_v2\napex\nshell_v2\nfixed_push_mkdir\ncmd',
    };
    output[`-s ${id} shell ls -t -1 /data/local/tmp/appium_cache 2>&1 || echo _ERROR_`] = {
        stdout: '',
    };
    output[`-s ${id} mkdir -p /data/local/tmp/appium_cache`] = {
        stdout: '',
        exitCode: 0,
    };
    const fullLocalPathToApk = path.join(
        __dirname,
        '../../../../drop/electron/unified-dev/product/android-service/android-service.apk',
    );
    output[`PUSH PLACEHOLDER for '${id}' - MATCH IS VIA REGEX`] = {
        regexTarget: `^-s ${id} push .*android-service.apk /data/local/tmp/appium_cache`,
        stdout: '(truncated-package-path)...ed. 32.0 MB/s (181531 bytes in 0.005s)',
    };
    output[`-s ${id} install -r ${fullLocalPathToApk}`] = {
        stdout: 'Performing Streamed Install\nSuccess\n',
    };
}

function addPortForwardingCommands(id, output, port) {
    output[`-s ${id} ${portForwardingCommandMatch}${port} tcp:62442`] = {
        startTestServer: {
            port,
            path: successfulTestServerContentPath,
        },
    };
    output[`-s ${id} forward --remove tcp:${port}`] = {
        stopTestServer: { port },
    };
}

function addInputKeyeventCommands(id, output) {
    // These are the values thr virtual keyboard uses for focus testing.
    // See KevEventCode in src/electron/platform/android/adb-wrapper.ts
    const keyeventCodeMap = {
        up: 19,
        down: 20,
        left: 21,
        right: 22,
        tab: 61,
        enter: 66,
    };

    for (const keyeventCode of Object.values(keyeventCodeMap)) {
        output[`-s ${id} ${inputKeyeventCommandMatch} ${keyeventCode}`] = {
            stdout: '',
        };
    }
}

function addGrantOverlayPermissionCommands(id, output) {
    output[`-s ${id} ${resetOverlayPermissionCommandMatch}`] = {};
    output[`-s ${id} ${grantOverlayPermissionCommandMatch}`] = {};
}

function workingDeviceCommands(deviceIds, port) {
    const output = {
        'start-server': {},
        devices: {
            stdout: 'List of devices attached\n',
        },
    };

    for (const id of deviceIds) {
        const type = id.startsWith('emulator') ? 'emulator' : 'device';
        output.devices.stdout += `${id}\t${type}\n`;
    }

    for (const id of deviceIds) {
        addDeviceEnumerationCommands(id, output);
        addDeviceDetailCommands(id, output);
        addDetectServiceCommands(id, output);
        addInstallServiceCommands(id, output);
        addCheckPermissionsCommands(id, output);
        addGrantOverlayPermissionCommands(id, output);
        addPortForwardingCommands(id, output, port);
        addInputKeyeventCommands(id, output);
    }

    return output;
}

function delayAllCommands(delayMs, commands) {
    const output = cloneDeep(commands);
    for (const commandConfig of Object.values(output)) {
        commandConfig.delayMs = delayMs;
    }
    return output;
}

function cloneWithDisabledPattern(oldConfig, keyPatternToDisable) {
    const regex = new RegExp(keyPatternToDisable);
    const newConfig = {};

    for (const key in oldConfig) {
        if (regex.test(key)) {
            newConfig[key] = {
                stderr: 'Disabled by test config',
            };
        } else {
            newConfig[key] = oldConfig[key];
        }
    }

    return newConfig;
}

function simulateNoDevicesConnected(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, devicesCommandMatch + '$');
}

function simulateServiceNotInstalled(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, serviceInfoCommandMatch + '$');
}

function simulateServiceInstallationError(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, sdkVersionCommandMatch);
}

function simulateServiceLacksPermissions(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, serviceIsRunningCommandMatch);
}

function simulatePortForwardingError(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, portForwardingCommandMatch);
}

function simulateInputKeyeventError(oldConfig) {
    return cloneWithDisabledPattern(oldConfig, inputKeyeventCommandMatch);
}

const physicalDeviceName1 = 'device-1';
const physicalDeviceName2 = 'device-2';
const emulatorDeviceName = 'emulator-3';

module.exports = {
    commonAdbConfigs: {
        'single-device': workingDeviceCommands([physicalDeviceName1], 62442),
        'multiple-devices': workingDeviceCommands(
            [physicalDeviceName1, physicalDeviceName2, emulatorDeviceName],
            62442,
        ),
        'slow-single-device': delayAllCommands(
            5000,
            workingDeviceCommands([physicalDeviceName1], 62442),
        ),
    },
    delayAllCommands,
    physicalDeviceName1,
    physicalDeviceName2,
    emulatorDeviceName,
    simulateNoDevicesConnected,
    simulateServiceInstallationError,
    simulateServiceNotInstalled,
    simulateServiceLacksPermissions,
    simulatePortForwardingError,
    simulateInputKeyeventError,
};
