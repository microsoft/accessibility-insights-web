// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';

export class DevToolActions {
    public readonly setDevToolState = new SyncAction<boolean>();
    public readonly setInspectElement = new SyncAction<string[]>();
    public readonly setFrameUrl = new SyncAction<string>();
    public readonly getCurrentState = new SyncAction();
}
