// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';

export class InjectionActions {
    public readonly injectionCompleted = new SyncAction();
    public readonly injectionStarted = new SyncAction();
}
