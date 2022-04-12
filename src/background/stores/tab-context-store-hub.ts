// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PersistedData } from 'background/get-persisted-data';
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { NeedsReviewCardSelectionStore } from 'background/stores/needs-review-card-selection-store';
import { NeedsReviewScanResultStore } from 'background/stores/needs-review-scan-result-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { BaseStore } from '../../common/base-store';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { StoreType } from '../../common/types/store-type';
import { generateUID } from '../../common/uid-generator';
import { ActionHub } from '../actions/action-hub';
import { DetailsViewStore } from './details-view-store';
import { DevToolStore } from './dev-tools-store';
import { InspectStore } from './inspect-store';
import { PathSnippetStore } from './path-snippet-store';
import { StoreHub } from './store-hub';
import { TabStore } from './tab-store';
import { UnifiedScanResultStore } from './unified-scan-result-store';
import { VisualizationScanResultStore } from './visualization-scan-result-store';
import { VisualizationStore } from './visualization-store';

export class TabContextStoreHub implements StoreHub {
    public tabStore: TabStore;
    public visualizationStore: VisualizationStore;
    public visualizationScanResultStore: VisualizationScanResultStore;
    public devToolStore: DevToolStore;
    public detailsViewStore: DetailsViewStore;
    public inspectStore: InspectStore;
    public pathSnippetStore: PathSnippetStore;
    public unifiedScanResultStore: UnifiedScanResultStore;
    public cardSelectionStore: CardSelectionStore;
    public needsReviewCardSelectionStore: NeedsReviewCardSelectionStore;
    public needsReviewScanResultStore: NeedsReviewScanResultStore;

    constructor(
        actionHub: ActionHub,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        persistedData: PersistedData,
        indexedDBInstance: IndexedDBAPI,
        logger: Logger,
    ) {
        this.visualizationStore = new VisualizationStore(
            actionHub.visualizationActions,
            actionHub.tabActions,
            actionHub.injectionActions,
            visualizationConfigurationFactory,
            persistedData.visualizationStoreData,
            indexedDBInstance,
            logger,
        );
        this.visualizationStore.initialize();

        this.visualizationScanResultStore = new VisualizationScanResultStore(
            actionHub.visualizationScanResultActions,
            actionHub.tabActions,
            actionHub.tabStopRequirementActions,
            actionHub.visualizationActions,
            generateUID,
            visualizationConfigurationFactory,
            persistedData.visualizationScanResultStoreData,
            indexedDBInstance,
            logger,
        );
        this.visualizationScanResultStore.initialize();

        this.tabStore = new TabStore(
            actionHub.tabActions,
            actionHub.visualizationActions,
            persistedData.tabStoreData,
            indexedDBInstance,
            logger,
        );
        this.tabStore.initialize();

        this.devToolStore = new DevToolStore(
            actionHub.devToolActions,
            persistedData.devToolStoreData,
            indexedDBInstance,
            logger,
        );
        this.devToolStore.initialize();

        this.detailsViewStore = new DetailsViewStore(
            actionHub.contentActions,
            actionHub.detailsViewActions,
            actionHub.sidePanelActions,
            persistedData.detailsViewStoreData,
            indexedDBInstance,
            logger,
        );
        this.detailsViewStore.initialize();

        this.inspectStore = new InspectStore(
            actionHub.inspectActions,
            actionHub.tabActions,
            persistedData.inspectStoreData,
            indexedDBInstance,
            logger,
        );
        this.inspectStore.initialize();

        this.pathSnippetStore = new PathSnippetStore(
            actionHub.pathSnippetActions,
            persistedData.pathSnippetStoreData,
            indexedDBInstance,
            logger,
        );
        this.pathSnippetStore.initialize();

        this.unifiedScanResultStore = new UnifiedScanResultStore(
            actionHub.unifiedScanResultActions,
            actionHub.tabActions,
            persistedData.unifiedScanResultStoreData,
            indexedDBInstance,
            logger,
        );
        this.unifiedScanResultStore.initialize();

        this.cardSelectionStore = new CardSelectionStore(
            actionHub.cardSelectionActions,
            actionHub.unifiedScanResultActions,
            persistedData.cardSelectionStoreData,
            indexedDBInstance,
            logger,
        );
        this.cardSelectionStore.initialize();

        this.needsReviewScanResultStore = new NeedsReviewScanResultStore(
            actionHub.needsReviewScanResultActions,
            actionHub.tabActions,
            persistedData.needsReviewScanResultsStoreData,
            indexedDBInstance,
            logger,
        );
        this.needsReviewScanResultStore.initialize();

        this.needsReviewCardSelectionStore = new NeedsReviewCardSelectionStore(
            actionHub.needsReviewCardSelectionActions,
            actionHub.needsReviewScanResultActions,
            persistedData.needsReviewCardSelectionStoreData,
            indexedDBInstance,
            logger,
        );
        this.needsReviewCardSelectionStore.initialize();
    }

    public getAllStores(): BaseStore<any>[] {
        return [
            this.tabStore,
            this.visualizationStore,
            this.visualizationScanResultStore,
            this.devToolStore,
            this.detailsViewStore,
            this.inspectStore,
            this.pathSnippetStore,
            this.unifiedScanResultStore,
            this.cardSelectionStore,
            this.needsReviewScanResultStore,
            this.needsReviewCardSelectionStore,
        ].filter(store => store != null);
    }

    public getStoreType(): StoreType {
        return StoreType.TabContextStore;
    }
}
