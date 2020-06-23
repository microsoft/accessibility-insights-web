// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';
import { DeviceInfo } from 'electron/platform/android/android-service-configurator';

export class AndroidSetupActionCreator {
    private readonly scope: string = 'AndroidSetupActionCreator';
    constructor(private readonly setupActions: AndroidSetupActions) {}

    public cancel = () => this.setupActions.cancel.invoke();
    public next = () => this.setupActions.next.invoke();
    public rescan = () => this.setupActions.rescan.invoke();
    public saveAdbPath = (newAdbPath: string) => this.setupActions.saveAdbPath.invoke(newAdbPath);
    public setSelectedDevice = (device: DeviceInfo) =>
        this.setupActions.setSelectedDevice.invoke(device);
    public readyToStart = () => this.setupActions.readyToStart.invoke(null, this.scope);
}
