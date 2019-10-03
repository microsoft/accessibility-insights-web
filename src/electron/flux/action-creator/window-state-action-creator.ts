import { RoutePayload } from '../action/route-payloads';
import { WindowStateActions } from '../action/window-state-actions';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class WindowStateActionCreator {
    constructor(private readonly windowStateActions: WindowStateActions) {}

    public setRoute(payload: RoutePayload): void {
        this.windowStateActions.setRoute.invoke(payload);
    }
}
