// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PersistedData } from 'background/get-persisted-data';
import { InitialVisualizationStoreDataGenerator } from 'background/initial-visualization-store-data-generator';
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { NeedsReviewCardSelectionStore } from 'background/stores/needs-review-card-selection-store';
import { NeedsReviewScanResultStore } from 'background/stores/needs-review-scan-result-store';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { UrlParser } from 'common/url-parser';
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
        tabId: number,
        urlParser: UrlParser,
        notificationCreator: NotificationCreator,
    ) {
        const persistStoreData = true;
        const persistedTabData = persistedData.tabData ? persistedData.tabData[tabId] : null;

        this.visualizationStore = new VisualizationStore(
            actionHub.visualizationActions,
            actionHub.tabActions,
            actionHub.injectionActions,
            visualizationConfigurationFactory,
            persistedTabData?.visualizationStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
            notificationCreator,
            new InitialVisualizationStoreDataGenerator(visualizationConfigurationFactory),
        );
        this.visualizationStore.initialize();

        this.visualizationScanResultStore = new VisualizationScanResultStore(
            actionHub.visualizationScanResultActions,
            actionHub.tabActions,
            actionHub.tabStopRequirementActions,
            actionHub.visualizationActions,
            generateUID,
            visualizationConfigurationFactory,
            persistedTabData?.visualizationScanResultStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.visualizationScanResultStore.initialize();

        this.tabStore = new TabStore(
            actionHub.tabActions,
            actionHub.visualizationActions,
            persistedTabData?.tabStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
            urlParser,
        );
        this.tabStore.initialize();

        this.devToolStore = new DevToolStore(
            actionHub.devToolActions,
            persistedTabData?.devToolStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.devToolStore.initialize();

        this.detailsViewStore = new DetailsViewStore(
            actionHub.contentActions,
            actionHub.detailsViewActions,
            actionHub.sidePanelActions,
            persistedTabData?.detailsViewStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.detailsViewStore.initialize();

        this.inspectStore = new InspectStore(
            actionHub.inspectActions,
            actionHub.tabActions,
            persistedTabData?.inspectStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.inspectStore.initialize();

        this.pathSnippetStore = new PathSnippetStore(
            actionHub.pathSnippetActions,
            persistedTabData?.pathSnippetStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.pathSnippetStore.initialize();

        this.unifiedScanResultStore = new UnifiedScanResultStore(
            actionHub.unifiedScanResultActions,
            actionHub.tabActions,
            persistedTabData?.unifiedScanResultStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.unifiedScanResultStore.initialize();

        this.cardSelectionStore = new CardSelectionStore(
            actionHub.cardSelectionActions,
            actionHub.unifiedScanResultActions,
            actionHub.tabActions,
            persistedTabData?.cardSelectionStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.cardSelectionStore.initialize();

        this.needsReviewScanResultStore = new NeedsReviewScanResultStore(
            actionHub.needsReviewScanResultActions,
            actionHub.tabActions,
            persistedTabData?.needsReviewScanResultsStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.needsReviewScanResultStore.initialize();

        this.needsReviewCardSelectionStore = new NeedsReviewCardSelectionStore(
            actionHub.needsReviewCardSelectionActions,
            actionHub.needsReviewScanResultActions,
            actionHub.tabActions,
            persistedTabData?.needsReviewCardSelectionStoreData,
            indexedDBInstance,
            logger,
            tabId,
            persistStoreData,
        );
        this.needsReviewCardSelectionStore.initialize();
    }

    public getAllStores(): PersistentStore<any>[] {
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
