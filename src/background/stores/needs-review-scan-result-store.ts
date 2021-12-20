// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewScanResultActions } from 'background/actions/needs-review-scan-result-actions';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { StoreNames } from '../../common/stores/store-names';
import { UnifiedScanCompletedPayload } from '../actions/action-payloads';
import { BaseStoreImpl } from './base-store-impl';

export class NeedsReviewScanResultStore extends BaseStoreImpl<NeedsReviewScanResultStoreData> {
    constructor(private readonly needsReviewScanResultActions: NeedsReviewScanResultActions) {
        super(StoreNames.NeedsReviewScanResultStore);
    }

    public getDefaultState(): NeedsReviewScanResultStoreData {
        const defaultValue: NeedsReviewScanResultStoreData = {
            results: null,
            rules: null,
            toolInfo: null,
            targetAppInfo: null,
            timestamp: null,
            scanIncompleteWarnings: null,
            screenshotData: null,
            platformInfo: null,
        };

        return defaultValue;
    }

    protected addActionListeners(): void {
        this.needsReviewScanResultActions.getCurrentState.addListener(this.onGetCurrentState);
        this.needsReviewScanResultActions.scanCompleted.addListener(this.onScanCompleted);
    }

    private onScanCompleted = (payload: UnifiedScanCompletedPayload): void => {
        this.state.results = payload.scanResult;
        this.state.rules = payload.rules;
        this.state.toolInfo = payload.toolInfo;
        this.state.targetAppInfo = payload.targetAppInfo;
        this.state.timestamp = payload.timestamp;
        this.state.scanIncompleteWarnings = payload.scanIncompleteWarnings;
        this.state.screenshotData = payload.screenshotData;
        this.state.platformInfo = payload.platformInfo;
        this.emitChanged();
    };
}
