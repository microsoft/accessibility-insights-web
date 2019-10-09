// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanActions } from 'electron/flux/action/scan-actions';

export class ScanActionCreator {
    constructor(private readonly scanActions: ScanActions) {}

    public scan(port: number): void {
        this.scanActions.scanStarted.invoke({ port });
    }
}
