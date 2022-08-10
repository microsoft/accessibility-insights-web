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
        this.scanActions.scanFailed.addListener(this.onScanFailed);
    }

    private onScanStarted = () => {
        if (this.state.status === ScanStatus.Scanning) {
            return;
        }

        this.state.status = ScanStatus.Scanning;

        this.emitChanged();
    };

    private onScanCompleted = () => this.onScanFinished(ScanStatus.Completed);

    private onScanFailed = () => this.onScanFinished(ScanStatus.Failed);

    private onScanFinished(finalStatus: ScanStatus): void {
        if (this.state.status !== ScanStatus.Scanning) {
            return;
        }

        this.state.status = finalStatus;

        this.emitChanged();
    }
}
