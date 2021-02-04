// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';

export enum DeviceFocusCommand {
    'Resume',
    'Pause',
    'End',
}
export type FocusCommandSender = (port: number, command: DeviceFocusCommand) => Promise<void>;

export type HttpGet = typeof axios.get;

export const createFocusCommandSender = (httpGet: HttpGet): FocusCommandSender => {
    return async (port: number, command: DeviceFocusCommand) => {
        await httpGet(`http://localhost:${port}/AccessibilityInsights/FocusTracking/${command}`);
    };
};
