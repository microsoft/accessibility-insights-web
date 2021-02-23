// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';

export class TabStopsActionCreator {
    constructor(
        private readonly tabStopsActions: TabStopsActions,
        private readonly deviceFocusController: DeviceFocusController,
    ) {}

    public enableTabStops = () => {
        this.tabStopsActions.enableFocusTracking.invoke();
        this.deviceFocusController.enableFocusTracking();
    };

    public disableTabStops = () => {
        this.tabStopsActions.disableFocusTracking.invoke();
        this.deviceFocusController.disableFocusTracking();
    };

    public startOver = () => {
        this.tabStopsActions.startOver.invoke();
        this.deviceFocusController.resetFocusTracking();
    };

    public sendUpKey = () => {
        this.deviceFocusController.sendUpKey();
    };

    public sendDownKey = () => {
        this.deviceFocusController.sendDownKey();
    };

    public sendLeftKey = () => {
        this.deviceFocusController.sendLeftKey();
    };

    public sendRightKey = () => {
        this.deviceFocusController.sendRightKey();
    };

    public sendTabKey = () => {
        this.deviceFocusController.sendTabKey();
    };

    public sendEnterKey = () => {
        this.deviceFocusController.sendEnterKey();
    };
}
