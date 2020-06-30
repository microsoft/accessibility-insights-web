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
        stdout: `versionName=${apkVersionName}\nversionCode=12345`,
    },
    '-s device-1 shell dumpsys accessibility': {
        stdout: 'label=Accessibility Insights',
    },
    '-s device-1 shell dumpsys media_projection': {
        stdout: 'com.microsoft.accessibilityinsightsforandroidservice',
    },
    // TODO after implementing test port support with portfinder:
    // [`-s device-1 forward tcp:${TEST_PORT} tcp:62442`]: {},
};
