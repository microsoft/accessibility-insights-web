// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceActions } from 'electron/flux/action/device-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';

export class ScanActionCreator {
    constructor(
        private readonly scanActions: ScanActions,
        private readonly deviceActions: DeviceActions,
    ) {}

    public scan(port: number): void {
        this.deviceActions.resetConnection.invoke();
        this.scanActions.scanStarted.invoke({ port });
    }
}
