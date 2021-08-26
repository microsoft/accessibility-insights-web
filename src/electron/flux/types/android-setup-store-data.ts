// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceInfo } from 'electron/platform/android/adb-wrapper';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';

export type AndroidSetupStoreData = {
    currentStepId: AndroidSetupStepId;

    // undefined if no device exists or if no device has been selected
    selectedDevice?: DeviceInfo;
    availableDevices?: DeviceInfo[];

    applicationName?: string;
};
