// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';

export class DeviceConnectionActions {
    public readonly statusUnknown = new AsyncAction<void>();
    public readonly statusConnected = new AsyncAction<void>();
    public readonly statusDisconnected = new AsyncAction<void>();
}
