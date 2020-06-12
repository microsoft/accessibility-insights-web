// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupActions } from 'electron/flux/action/android-setup-actions';

export class AndroidSetupActionCreator {
    constructor(private readonly setupActions: AndroidSetupActions) {}

    public cancel = () => this.setupActions.cancel.invoke();
    public next = () => this.setupActions.next.invoke();
    public rescan = () => this.setupActions.rescan.invoke();
    public saveAdbPath = (newAdbPath: string) => this.setupActions.saveAdbPath.invoke(newAdbPath);
    public setSelectedDevice = (selectedDeviceId: string) =>
        this.setupActions.setSelectedDevice.invoke(selectedDeviceId);
}
