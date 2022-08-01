// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';

export class ScanActions {
    public readonly scanStarted = new AsyncAction<void>();
    public readonly scanCompleted = new AsyncAction<void>();
    public readonly scanFailed = new AsyncAction<void>();
}
