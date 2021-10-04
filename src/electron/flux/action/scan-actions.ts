// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class ScanActions {
    public readonly scanStarted = new Action<void>();
    public readonly scanCompleted = new Action<void>();
    public readonly scanFailed = new Action<void>();
}
