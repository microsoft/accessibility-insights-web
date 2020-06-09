// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type TargetDeviceIcon = 'CellPhone' | 'Devices3';
export type DeviceMetadata = {
    iconName: TargetDeviceIcon;
    description: string;
    currentApplication?: string;
};
