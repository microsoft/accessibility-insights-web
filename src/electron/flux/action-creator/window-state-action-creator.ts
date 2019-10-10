// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowStatePayload } from 'electron/flux/action/window-state-payload';
import { RoutePayload } from '../action/route-payloads';
import { WindowStateActions } from '../action/window-state-actions';

export class WindowStateActionCreator {
    constructor(private readonly windowStateActions: WindowStateActions) {}

    public setRoute(payload: RoutePayload): void {
        this.windowStateActions.setRoute.invoke(payload);
    }

    public setWindowState(payload: WindowStatePayload): void {
        this.windowStateActions.setWindowState.invoke(payload);
    }
}
