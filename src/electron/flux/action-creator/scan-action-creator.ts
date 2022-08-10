// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { ScanActions } from 'electron/flux/action/scan-actions';

export class ScanActionCreator {
    private executingScope = 'ScanActionCreator';

    constructor(
        private readonly scanActions: ScanActions,
        private readonly deviceConnectionActions: DeviceConnectionActions,
    ) {}

    public scan(): void {
        this.deviceConnectionActions.statusUnknown.invoke(undefined, this.executingScope);
        this.scanActions.scanStarted.invoke(undefined, this.executingScope);
    }
}
