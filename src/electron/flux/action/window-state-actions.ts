// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { WindowStatePayload } from 'electron/flux/action/window-state-payload';
import { RoutePayload } from './route-payloads';

export class WindowStateActions {
    public readonly setRoute = new SyncAction<RoutePayload>();
    public readonly setWindowState = new SyncAction<WindowStatePayload>();
}
