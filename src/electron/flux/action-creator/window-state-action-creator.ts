// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { Rectangle } from 'electron';
import { WindowState } from 'electron/flux/types/window-state';
import { RoutePayload } from '../action/route-payloads';
import { WindowStateActions } from '../action/window-state-actions';
import { WindowStatePayload } from '../action/window-state-payload';
import { WindowFrameActionCreator } from './window-frame-action-creator';

export class WindowStateActionCreator {
    constructor(
        private readonly windowStateActions: WindowStateActions,
        private readonly windowFrameActionCreator: WindowFrameActionCreator,
        private readonly userConfigurationStore: UserConfigurationStore,
    ) {}

    public setRoute(payload: RoutePayload): void {
        this.windowStateActions.setRoute.invoke(payload);

        if (payload.routeId === 'deviceConnectView') {
            this.windowFrameActionCreator.setWindowSize({ width: 600, height: 391 });
        } else {
            this.setWindowBoundsFromSavedWindowBounds();
        }
    }

    public setWindowState(payload: WindowStatePayload): void {
        this.windowStateActions.setWindowState.invoke(payload);
    }

    private setWindowBoundsFromSavedWindowBounds(): void {
        const state: UserConfigurationStoreData = this.userConfigurationStore.getState();
        const lastWindowState: WindowState = state.lastWindowState;
        const lastWindowBounds: Rectangle = state.lastWindowBounds;

        // Fully restoring the previous state means setting the stored bounds
        // (if we have them), THEN setting maximize or full screen
        if (lastWindowBounds) {
            this.windowFrameActionCreator.setWindowBounds(lastWindowBounds);
        }

        switch (lastWindowState) {
            case 'normal':
                break; // Do nothing else
            case 'full-screen':
                this.windowFrameActionCreator.enterFullScreen();
                break;
            default:
                this.windowFrameActionCreator.maximize();
        }
    }
}
