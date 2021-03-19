// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionStore } from 'background/stores/card-selection-store';

import { BaseStore } from '../../common/base-store';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { StoreType } from '../../common/types/store-type';
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

    constructor(
        actionHub: ActionHub,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {
        this.visualizationStore = new VisualizationStore(
            actionHub.visualizationActions,
            actionHub.tabActions,
            actionHub.injectionActions,
            visualizationConfigurationFactory,
        );
        this.visualizationStore.initialize();

        this.visualizationScanResultStore = new VisualizationScanResultStore(
            actionHub.visualizationScanResultActions,
            actionHub.tabActions,
        );
        this.visualizationScanResultStore.initialize();

        this.tabStore = new TabStore(actionHub.tabActions, actionHub.visualizationActions);
        this.tabStore.initialize();

        this.devToolStore = new DevToolStore(actionHub.devToolActions);
        this.devToolStore.initialize();

        this.detailsViewStore = new DetailsViewStore(
            actionHub.contentActions,
            actionHub.detailsViewActions,
            actionHub.sidePanelActions,
        );
        this.detailsViewStore.initialize();

        this.inspectStore = new InspectStore(actionHub.inspectActions, actionHub.tabActions);
        this.inspectStore.initialize();

        this.pathSnippetStore = new PathSnippetStore(actionHub.pathSnippetActions);
        this.pathSnippetStore.initialize();

        this.unifiedScanResultStore = new UnifiedScanResultStore(actionHub.scanResultActions);
        this.unifiedScanResultStore.initialize();

        this.cardSelectionStore = new CardSelectionStore(
            actionHub.cardSelectionActions,
            actionHub.scanResultActions,
        );
        this.cardSelectionStore.initialize();
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
        ].filter(store => store != null);
    }

    public getStoreType(): StoreType {
        return StoreType.TabContextStore;
    }
}
