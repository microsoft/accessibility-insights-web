// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStore } from 'electron/flux/store/android-setup-store';
import { KeyEventCode } from 'electron/platform/android/adb-wrapper';
import { AndroidServicePackageName } from 'electron/platform/android/android-service-apk-locator';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';

export class DeviceCommunicator {
    private readonly servicePackageName: string = AndroidServicePackageName;

    constructor(
        private readonly adbWrapperHolder: AdbWrapperHolder,
        private readonly androidSetupStore: AndroidSetupStore,
    ) {}

    public fetchContent = async (contentType: 'result' | 'config'): Promise<string> => {
        const selectedDevice = this.getSelectedDeviceId();

        const content = await this.adbWrapperHolder
            .getAdb()
            .readContent(selectedDevice, `content://${this.servicePackageName}/${contentType}`);
        return content;
    };

    public sendCommand = async (command: string): Promise<void> => {
        const selectedDevice = this.getSelectedDeviceId();

        await this.adbWrapperHolder
            .getAdb()
            .callContent(selectedDevice, `content://${this.servicePackageName}`, command);
    };

    public pressKey = async (keyCode: KeyEventCode): Promise<void> => {
        const selectedDevice = this.getSelectedDeviceId();

        await this.adbWrapperHolder.getAdb().sendKeyEvent(selectedDevice, keyCode);
    };

    private getSelectedDeviceId = (): string => {
        const selectedDevice = this.androidSetupStore.getState().selectedDevice;
        if (selectedDevice == null) {
            throw new Error('selected device not found');
        }
        return selectedDevice.id;
    };
}
