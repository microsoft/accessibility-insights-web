// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { AsyncAction } from 'common/flux/async-action';

export class PermissionsStateActions {
    public readonly getCurrentState = new AsyncAction<void>();
    public readonly setPermissionsState = new AsyncAction<SetAllUrlsPermissionStatePayload>();
}
