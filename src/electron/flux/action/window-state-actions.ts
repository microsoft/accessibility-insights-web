// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';
import { RoutePayload } from './route-payloads';

export class WindowStateActions {
    public readonly setRoute = new Action<RoutePayload>();
}
