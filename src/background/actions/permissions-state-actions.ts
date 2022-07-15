// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { SyncAction } from 'common/flux/sync-action';

export class PermissionsStateActions {
    public readonly getCurrentState = new SyncAction<void>();
    public readonly setPermissionsState = new SyncAction<SetAllUrlsPermissionStatePayload>();
}
