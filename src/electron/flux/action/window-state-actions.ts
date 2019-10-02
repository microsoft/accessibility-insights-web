// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Action } from 'common/flux/action';

export class WindowStateActions {
    public readonly setDeviceConnectRoute = new Action<void>();
    public readonly setResultsViewRoute = new Action<void>();
}
