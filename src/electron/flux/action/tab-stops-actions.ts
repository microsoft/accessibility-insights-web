// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class TabStopsActions {
    public readonly enableFocusTracking = new Action<void>();
    public readonly disableFocusTracking = new Action<void>();
    public readonly startOver = new Action<void>();
}
