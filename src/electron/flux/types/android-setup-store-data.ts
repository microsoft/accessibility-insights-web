// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceMetadata } from 'electron/flux/types/device-metadata';
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';

export type AndroidSetupStoreData = {
    currentStepId: AndroidSetupStepId;

    // undefined if no device exists or if no device has been selected
    selectedDevice?: DeviceMetadata;
};
