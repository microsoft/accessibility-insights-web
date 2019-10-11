// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { RoutePayload } from '../action/route-payloads';
import { WindowStateActions } from '../action/window-state-actions';

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
}
