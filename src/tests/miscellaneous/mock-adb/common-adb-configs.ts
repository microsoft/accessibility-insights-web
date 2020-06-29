// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MockAdbConfig } from './mock-adb';

export const singleDeviceConfig: MockAdbConfig = {
    devices: { stdout: 'List of devices attached\ndevice-id-1      device' },
    // etc
};
