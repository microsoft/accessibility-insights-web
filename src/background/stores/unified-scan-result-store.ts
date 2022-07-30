// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from 'background/actions/tab-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from '../../common/stores/store-names';
import { UnifiedScanResultStoreData } from '../../common/types/store-data/unified-data-interface';
import { UnifiedScanCompletedPayload } from '../actions/action-payloads';
import { UnifiedScanResultActions } from '../actions/unified-scan-result-actions';

export class UnifiedScanResultStore extends PersistentStore<UnifiedScanResultStoreData> {
    constructor(
        private readonly unifiedScanResultActions: UnifiedScanResultActions,
        private readonly tabActions: TabActions,
        persistedState: UnifiedScanResultStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
    ) {
        super(
            StoreNames.UnifiedScanResultStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.unifiedScanResultStore(tabId),
            logger,
            persistStoreData,
        );
    }

    public getDefaultState(): UnifiedScanResultStoreData {
        const defaultValue: UnifiedScanResultStoreData = {
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
        this.emitChanged();
    };

    private onResetStoreData = async (): Promise<void> => {
        this.state = this.getDefaultState();
        this.emitChanged();
    };
}
