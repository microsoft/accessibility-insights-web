// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isObject, isString } from 'lodash';

export type DeviceConfig = {
    deviceName: string;
    appIdentifier: string;
};

export type DeviceConfigParser = (rawData: any) => DeviceConfig;

export const parseDeviceConfig: DeviceConfigParser = (rawData: any): DeviceConfig => {
    if (!isObject(rawData)) {
        throw new Error(`parseDeviceConfig: invalid DeviceConfig object: ${rawData}`);
    }

    const output: DeviceConfig = {
        deviceName: (rawData as any).deviceName,
        appIdentifier: (rawData as any).packageName,
    };

    if (!isString(output.deviceName)) {
        throw new Error(`parseDeviceConfig: invalid deviceName: ${output.deviceName}`);
    }
    if (!isString(output.appIdentifier)) {
        throw new Error(
            `parseDeviceConfig: invalid packageName/appIdentifier: ${output.appIdentifier}`,
        );
    }
    return output;
};
