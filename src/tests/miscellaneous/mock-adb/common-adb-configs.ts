// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { apkVersionName } from 'accessibility-insights-for-android-service-bin';
import { MockAdbConfig } from './mock-adb';

export const singleDeviceConfig: MockAdbConfig = {
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
    // TODO after implementing test port support with portfinder:
    // [`-s device-1 forward tcp:${TEST_PORT} tcp:62442`]: {},
};
