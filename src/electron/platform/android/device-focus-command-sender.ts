// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';

export enum DeviceFocusCommand {
    Enable = 'Enable',
    Disable = 'Disable',
    Reset = 'Reset',
}

export type DeviceFocusCommandSender = (port: number, command: DeviceFocusCommand) => Promise<void>;

export type HttpGet = typeof axios.get;

export const createDeviceFocusCommandSender = (httpGet: HttpGet): DeviceFocusCommandSender => {
    return async (port: number, command: DeviceFocusCommand) => {
        await httpGet(`http://localhost:${port}/AccessibilityInsights/FocusTracking/${command}`);
    };
};
