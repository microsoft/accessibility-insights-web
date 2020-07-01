// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { apkVersionName } = require('accessibility-insights-for-android-service-bin');
const path = require('path');

const successfulTestServerContentPath = path.join(
    __dirname,
    '../mock-service-for-android/AccessibilityInsights',
);

module.exports = {
    commonAdbConfigs: {
        'single-device': {
            'start-server': {},
            devices: {
                stdout: 'List of devices attached\ndevice-1\tdevice',
            },
            '-s device-1 shell getprop ro.product.model': {
                stdout: 'mock-adb device 1',
            },
            '-s device-1 shell dumpsys package com.microsoft.accessibilityinsightsforandroidservice': {
                stdout: `    versionCode=102000 minSdk=24 targetSdk=28\n    versionName=${apkVersionName}`,
            },
            '-s device-1 shell dumpsys accessibility': {
                stdout:
                    '                     Service[label=Accessibility Insights for…, feedbackType[FEEDBACK_SPOKEN, FEEDBACK_HAPTIC, FEEDBACK_AUDIBLE, FEEDBACK_VISUAL, FEEDBACK_GENERIC, FEEDBACK_BRAILLE], capabilities=1, eventTypes=TYPES_ALL_MASK, notificationTimeout=0]}',
            },
            '-s device-1 shell dumpsys media_projection': {
                stdout:
                    '(com.microsoft.accessibilityinsightsforandroidservice, uid=12354): TYPE_SCREEN_CAPTURE',
            },
            '-s device-1 forward tcp:62442 tcp:62442': {
                startTestServer: {
                    port: 62442,
                    path: successfulTestServerContentPath,
                },
            },
            '-s device-1 forward --remove tcp:62442': {
                stopTestServer: {
                    port: 62442,
                },
            },
            '-s device-1 forward --remove': {
                stdout: '/n',
            },
        },
    },
};
