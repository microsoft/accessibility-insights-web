// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { apkVersionName } = require('accessibility-insights-for-android-service-bin');
const cloneDeep = require('lodash/cloneDeep');
const path = require('path');

const successfulTestServerContentPath = path.join(
    __dirname,
    '../mock-service-for-android/AccessibilityInsights',
);

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
        output[`-s ${id} devices`] = { ...output.devices };
        output[`-s ${id} shell getprop ro.product.model`] = {
            stdout: `working mock device (${id})`,
        };
        output[
            `-s ${id} shell dumpsys package com.microsoft.accessibilityinsightsforandroidservice`
        ] = {
            stdout: `    versionCode=102000 minSdk=24 targetSdk=28\n    versionName=${apkVersionName}`,
        };
        output[`-s ${id} shell dumpsys accessibility`] = {
            stdout:
                '                     Service[label=Accessibility Insights for…, feedbackType[FEEDBACK_SPOKEN, FEEDBACK_HAPTIC, FEEDBACK_AUDIBLE, FEEDBACK_VISUAL, FEEDBACK_GENERIC, FEEDBACK_BRAILLE], capabilities=1, eventTypes=TYPES_ALL_MASK, notificationTimeout=0]}',
        };
        output[`-s ${id} shell dumpsys media_projection`] = {
            stdout:
                '(com.microsoft.accessibilityinsightsforandroidservice, uid=12354): TYPE_SCREEN_CAPTURE',
        };
        output[`-s ${id} forward tcp:${port} tcp:62442`] = {
            startTestServer: {
                port,
                path: successfulTestServerContentPath,
            },
        };
        output[`-s ${id} forward --remove tcp:${port}`] = {
            stopTestServer: { port },
        };
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

module.exports = {
    commonAdbConfigs: {
        'single-device': workingDeviceCommands(['device-1'], 62442),
        'multiple-devices': workingDeviceCommands(['device-1', 'device-2', 'emulator-3'], 62442),
        'slow-single-device': delayAllCommands(5000, workingDeviceCommands(['device-1'], 62442)),
    },
};
