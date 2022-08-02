// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';
import { WindowStatePayload } from 'electron/flux/action/window-state-payload';
import { RoutePayload } from './route-payloads';

export class WindowStateActions {
    public readonly setRoute = new AsyncAction<RoutePayload>();
    public readonly setWindowState = new AsyncAction<WindowStatePayload>();
}
