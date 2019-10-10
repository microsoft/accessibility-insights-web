// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { PortPayload } from 'electron/flux/action/device-action-payloads';

export class ScanActions {
    public readonly scanStarted = new Action<PortPayload>();
    public readonly scanCompleted = new Action<void>();
    public readonly scanFailed = new Action<void>();
}
