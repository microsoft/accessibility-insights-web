// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { StoreNames } from '../../common/stores/store-names';
import { UnifiedScanCompletedPayload } from '../actions/action-payloads';
import { UnifiedScanResultActions } from '../actions/unified-scan-result-actions';
import { BaseStoreImpl } from './base-store-impl';

export class NeedsReviewScanResultStore extends BaseStoreImpl<NeedsReviewScanResultStoreData> {
    constructor(private readonly unifiedScanResultActions: UnifiedScanResultActions) {
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
        this.unifiedScanResultActions.getCurrentState.addListener(this.onGetCurrentState);
        this.unifiedScanResultActions.scanCompleted.addListener(this.onScanCompleted);
        this.unifiedScanResultActions.startScan.addListener(this.onScanStarted);
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

    private onScanStarted = (test: VisualizationType): void => {
        if (test === VisualizationType.TabStops) {
            return;
        }
        this.state = this.getDefaultState();
        this.emitChanged();
    };
}
