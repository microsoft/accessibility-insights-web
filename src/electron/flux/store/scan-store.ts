// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';

import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanActions } from '../action/scan-actions';
import { ScanStoreData } from '../types/scan-store-data';

export class ScanStore extends BaseStoreImpl<ScanStoreData> {
    constructor(private readonly scanActions: ScanActions) {
        super(StoreNames.ScanStore);
    }

    public getDefaultState(): ScanStoreData {
        return {
            status: ScanStatus.Default,
        };
    }

    protected addActionListeners(): void {
        this.scanActions.scanStarted.addListener(this.onScanStarted);
        this.scanActions.scanCompleted.addListener(this.onScanCompleted);
    }

    private onScanStarted = () => this.updateToStatus(ScanStatus.Scanning);
    private onScanCompleted = () => this.updateToStatus(ScanStatus.Completed);

    private updateToStatus(newStatus: ScanStatus): void {
        if (this.state.status === newStatus) {
            return;
        }

        this.state.status = newStatus;

        this.emitChanged();
    }
}
