// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../../common/base-store';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { StoreType } from '../../common/types/store-type';
import { ActionHub } from '../actions/action-hub';
import { DetailsViewStore } from './details-view-store';
import { DevToolStore } from './dev-tools-store';
import { InspectStore } from './inspect-store';
import { IssueFilingStore } from './issue-filing-store';
import { StoreHub } from './store-hub';
import { TabStore } from './tab-store';
import { VisualizationScanResultStore } from './visualization-scan-result-store';
import { VisualizationStore } from './visualization-store';

export class TabContextStoreHub implements StoreHub {
    public tabStore: TabStore;
    public visualizationStore: VisualizationStore;
    public visualizationScanResultStore: VisualizationScanResultStore;
    public devToolStore: DevToolStore;
    public detailsViewStore: DetailsViewStore;
    public inspectStore: InspectStore;
    public issueFilingStore: IssueFilingStore;

    constructor(actionHub: ActionHub, visualizationConfigurationFactory: VisualizationConfigurationFactory) {
        this.visualizationStore = new VisualizationStore(
            actionHub.visualizationActions,
            actionHub.tabActions,
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
            actionHub.previewFeaturesActions,
            actionHub.scopingActions,
            actionHub.contentActions,
            actionHub.detailsViewActions,
        );
        this.detailsViewStore.initialize();

        this.inspectStore = new InspectStore(actionHub.inspectActions, actionHub.tabActions);
        this.inspectStore.initialize();

        this.issueFilingStore = new IssueFilingStore(actionHub.issueFilingActions);
        this.issueFilingStore.initialize();
    }

    public getAllStores(): BaseStore<any>[] {
        return [
            this.tabStore,
            this.visualizationStore,
            this.visualizationScanResultStore,
            this.devToolStore,
            this.detailsViewStore,
            this.inspectStore,
            this.issueFilingStore,
        ].filter(store => store != null);
    }

    public getStoreType(): StoreType {
        return StoreType.TabContextStore;
    }
}
