// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RoutePayload } from '../action/route-payloads';
import { WindowStateActions } from '../action/window-state-actions';
import { WindowStatePayload } from '../action/window-state-payload';
import { WindowFrameActionCreator } from './window-frame-action-creator';

export class WindowStateActionCreator {
    constructor(
        private readonly windowStateActions: WindowStateActions,
        private readonly windowFrameActionCreator: WindowFrameActionCreator,
    ) {}

    public setRoute(payload: RoutePayload): void {
        this.windowStateActions.setRoute.invoke(payload);

        if (payload.routeId === 'deviceConnectView') {
            this.windowFrameActionCreator.setWindowSize({ width: 600, height: 391 });
        }
    }

    public setWindowState(payload: WindowStatePayload): void {
        this.windowStateActions.setWindowState.invoke(payload);
    }
}
