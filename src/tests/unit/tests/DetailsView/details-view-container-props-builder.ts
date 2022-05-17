// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { StoreActionMessageCreator } from 'common/message-creators/store-action-message-creator';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { ScopingStoreData } from 'common/types/store-data/scoping-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import {
    DetailsViewContainerDeps,
    DetailsViewContainerProps,
    DetailsViewContainerState,
} from 'DetailsView/details-view-container';
import { DictionaryStringTo } from 'types/common-types';
import { StoreMocks } from './store-mocks';

export class DetailsViewContainerPropsBuilder {
    private visualizationStore: BaseStore<VisualizationStoreData>;
    private assessmentStore: BaseStore<AssessmentStoreData>;
    private visualizationScanResultStore: BaseStore<VisualizationScanResultData>;
    private unifiedScanResultStore: BaseStore<UnifiedScanResultStoreData>;
    private tabStore: BaseStore<TabStoreData>;
    private featureFlagStore: BaseStore<DictionaryStringTo<boolean>>;
    private scopingStateStore: BaseStore<ScopingStoreData>;
    private detailsViewStore: BaseStore<DetailsViewStoreData>;
    private storeActionCreator: StoreActionMessageCreator;
    private storesHub: BaseClientStoresHub<any>;
    constructor(private deps: DetailsViewContainerDeps) {}

    public setDetailsViewStoreActionMessageCreator(
        creator: StoreActionMessageCreator,
    ): DetailsViewContainerPropsBuilder {
        this.storeActionCreator = creator;
        return this;
    }

    public setStoreActionMessageCreator(
        creator: StoreActionMessageCreator,
    ): DetailsViewContainerPropsBuilder {
        this.storeActionCreator = creator;
        return this;
    }

    public setDropdownClickHandler(
        creator: DropdownClickHandler,
    ): DetailsViewContainerPropsBuilder {
        if (this.deps == null) {
            this.deps = {} as DetailsViewContainerDeps;
        }

        this.deps.dropdownClickHandler = creator;

        return this;
    }

    public setStoresHubMock(hub: BaseClientStoresHub<any>): DetailsViewContainerPropsBuilder {
        this.storesHub = hub;
        return this;
    }

    public setStoreMocks(storeMocks: StoreMocks): DetailsViewContainerPropsBuilder {
        this.visualizationScanResultStore = storeMocks.visualizationScanResultStoreMock.object;
        this.unifiedScanResultStore = storeMocks.unifiedScanResultStoreMock.object;
        this.visualizationStore = storeMocks.visualizationStoreMock.object;
        this.tabStore = storeMocks.tabStoreMock.object;
        this.detailsViewStore = storeMocks.detailsViewStoreMock.object;
        this.featureFlagStore = storeMocks.featureFlagStoreMock.object;
        this.assessmentStore = storeMocks.assessmentStoreMock.object;
        this.scopingStateStore = storeMocks.scopingStoreMock.object;
        return this;
    }

    public build(): DetailsViewContainerProps {
        const storesHub =
            this.storesHub ||
            new BaseClientStoresHub([
                this.detailsViewStore,
                this.featureFlagStore,
                this.tabStore,
                this.visualizationScanResultStore,
                this.unifiedScanResultStore,
                this.visualizationStore,
                this.assessmentStore,
                this.scopingStateStore,
            ]);

        const storeState = this.storesHub ? this.storesHub.getAllStoreData() : null;
        if (this.deps !== null) {
            this.deps.storesHub = storesHub;
            this.deps.storeActionMessageCreator = this.storeActionCreator;
        }

        const props: DetailsViewContainerProps = {
            deps: this.deps,
            storeState: storeState as DetailsViewContainerState,
        };

        return props;
    }
}
