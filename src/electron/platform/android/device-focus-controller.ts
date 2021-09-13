// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import { DeviceCommunicator } from 'electron/platform/android/device-communicator';

export enum DeviceFocusCommand {
    Enable = 'Enable',
    Disable = 'Disable',
    Reset = 'Reset',
}

export const FocusCommandPrefix = 'FocusTracking';
export class DeviceFocusController {
    constructor(private readonly deviceCommunicator: DeviceCommunicator) {}

    public enableFocusTracking = async () => {
        await this.deviceCommunicator.sendCommand(
            `${FocusCommandPrefix}/${DeviceFocusCommand.Enable}`,
        );
    };

    public disableFocusTracking = async () => {
        await this.deviceCommunicator.sendCommand(
            `${FocusCommandPrefix}/${DeviceFocusCommand.Disable}`,
        );
    };

    public resetFocusTracking = async () => {
        await this.deviceCommunicator.sendCommand(
            `${FocusCommandPrefix}/${DeviceFocusCommand.Reset}`,
        );
    };

    public sendKeyEvent = async (keyEventCode: KeyEventCode) => {
        await this.deviceCommunicator.pressKey(keyEventCode);
    };
}
