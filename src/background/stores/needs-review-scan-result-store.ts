// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewScanResultActions } from 'background/actions/needs-review-scan-result-actions';
import { TabActions } from 'background/actions/tab-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { StoreNames } from '../../common/stores/store-names';
import { UnifiedScanCompletedPayload } from '../actions/action-payloads';

export class NeedsReviewScanResultStore extends PersistentStore<NeedsReviewScanResultStoreData> {
    constructor(
        private readonly needsReviewScanResultActions: NeedsReviewScanResultActions,
        private readonly tabActions: TabActions,
        persistedState: NeedsReviewScanResultStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
    ) {
        super(
            StoreNames.NeedsReviewScanResultStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.needsReviewScanResultsStore(tabId),
            logger,
        );
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
        this.tabActions.existingTabUpdated.addListener(this.onResetStoreData);
    }

    private onScanCompleted = async (payload: UnifiedScanCompletedPayload): Promise<void> => {
        this.state.results = payload.scanResult;
        this.state.rules = payload.rules;
        this.state.toolInfo = payload.toolInfo;
        this.state.targetAppInfo = payload.targetAppInfo;
        this.state.timestamp = payload.timestamp;
        this.state.scanIncompleteWarnings = payload.scanIncompleteWarnings;
        this.state.screenshotData = payload.screenshotData;
        this.state.platformInfo = payload.platformInfo;
        await this.emitChanged();
    };

    private onResetStoreData = async (): Promise<void> => {
        this.state = this.getDefaultState();
        await this.emitChanged();
    };
}
