// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavStore } from 'electron/flux/store/left-nav-store';
import { TabStopsStore } from 'electron/flux/store/tab-stops-store';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';

export class DeviceFocusMinder {
    private lastSelectedKey: LeftNavItemKey;

    constructor(
        private readonly deviceFocusController: DeviceFocusController,
        private readonly tabStopsStore: TabStopsStore,
        private readonly leftNavStore: LeftNavStore,
    ) {}

    public initialize() {
        this.leftNavStore.addChangedListener(this.onLeftNavChanged);
    }

    private onLeftNavChanged = (): void => {
        const selectedKey: LeftNavItemKey = this.leftNavStore.getState().selectedKey;

        const disableTracking =
            selectedKey !== this.lastSelectedKey &&
            this.lastSelectedKey === 'tab-stops' &&
            this.tabStopsStore.getState().focusTracking;

        this.lastSelectedKey = selectedKey;

        if (disableTracking) {
            // Suppress the disconnected device popup on error
            this.deviceFocusController.resetFocusTracking().then().catch();
        }
    };
}
