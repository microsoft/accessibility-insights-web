// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { WindowSize } from 'common/types/store-data/user-configuration-store';
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
            this.setWindowSizeBasedOnLastWindowSize();
        }
    }

    public setWindowState(payload: WindowStatePayload): void {
        this.windowStateActions.setWindowState.invoke(payload);
    }

    private setWindowSizeBasedOnLastWindowSize(): void {
        const lastWindowSize: WindowSize = this.userConfigurationStore.getState().lastWindowSize;
        if (lastWindowSize !== null) {
            this.windowFrameActionCreator.setWindowSize(lastWindowSize);
        } else {
            this.windowFrameActionCreator.maximize();
        }
    }
}
