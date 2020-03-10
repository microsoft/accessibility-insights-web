// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { ISelection } from 'office-ui-fabric-react';
import { BaseStore } from '../../../../common/base-store';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../../../../common/dropdown-click-handler';
import { InspectActionMessageCreator } from '../../../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../../../common/message-creators/scoping-action-message-creator';
import { StoreActionMessageCreator } from '../../../../common/message-creators/store-action-message-creator';
import { BaseClientStoresHub } from '../../../../common/stores/base-client-stores-hub';
import { AssessmentStoreData } from '../../../../common/types/store-data/assessment-result-data';
import { DetailsViewStoreData } from '../../../../common/types/store-data/details-view-store-data';
import { ScopingStoreData } from '../../../../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../../../../common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from '../../../../common/types/store-data/unified-data-interface';
import { VisualizationScanResultData } from '../../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../../../../common/types/store-data/visualization-store-data';
import { IssuesTableHandler } from '../../../../DetailsView/components/issues-table-handler';
import { DetailsViewContainerDeps, DetailsViewContainerProps } from '../../../../DetailsView/details-view-container';
import { AssessmentInstanceTableHandler } from '../../../../DetailsView/handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from '../../../../DetailsView/handlers/preview-feature-flags-handler';
import { DictionaryStringTo } from '../../../../types/common-types';
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
    private scopingActionMessageCreator: ScopingActionMessageCreator;
    private inspectActionMessageCreator: InspectActionMessageCreator;
    private storeActionCreator: StoreActionMessageCreator;
    private document: Document = document;
    private issuesSelection: ISelection;
    private clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    private issuesTableHandler: IssuesTableHandler;
    private previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    private scopingFlagsHandler: PreviewFeatureFlagsHandler;
    private dropdownClickHandler: DropdownClickHandler;
    private assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    private assessmentProvider: AssessmentsProvider;
    private configFactory: VisualizationConfigurationFactory;
    private storesHub: BaseClientStoresHub<any>;
    constructor(private deps: DetailsViewContainerDeps) {}

    public setDetailsViewStoreActionMessageCreator(creator: StoreActionMessageCreator): DetailsViewContainerPropsBuilder {
        this.storeActionCreator = creator;
        return this;
    }

    public setAssessmentProvider(provider: AssessmentsProvider): DetailsViewContainerPropsBuilder {
        this.assessmentProvider = provider;
        return this;
    }

    public setVisualizationConfigurationFactory(configFactory: VisualizationConfigurationFactory): DetailsViewContainerPropsBuilder {
        this.configFactory = configFactory;
        return this;
    }

    public setClickHandlerFactory(factory: DetailsViewToggleClickHandlerFactory): DetailsViewContainerPropsBuilder {
        this.clickHandlerFactory = factory;
        return this;
    }

    public setIssuesTableHandler(issuesTableHandler: IssuesTableHandler): DetailsViewContainerPropsBuilder {
        this.issuesTableHandler = issuesTableHandler;
        return this;
    }

    public setPreviewFeatureFlagsHandler(previewFeatureFlagsHandler: PreviewFeatureFlagsHandler): DetailsViewContainerPropsBuilder {
        this.previewFeatureFlagsHandler = previewFeatureFlagsHandler;
        return this;
    }

    public setIssuesSelection(selection: ISelection): DetailsViewContainerPropsBuilder {
        this.issuesSelection = selection;
        return this;
    }

    public setScopingActionMessageCreator(creator: ScopingActionMessageCreator): DetailsViewContainerPropsBuilder {
        this.scopingActionMessageCreator = creator;
        return this;
    }

    public setInspectActionMessageCreator(creator: InspectActionMessageCreator): DetailsViewContainerPropsBuilder {
        this.inspectActionMessageCreator = creator;
        return this;
    }

    public setStoreActionMessageCreator(creator: StoreActionMessageCreator): DetailsViewContainerPropsBuilder {
        this.storeActionCreator = creator;
        return this;
    }

    public setDropdownClickHandler(creator: DropdownClickHandler): DetailsViewContainerPropsBuilder {
        if (this.deps == null) {
            this.deps = {} as DetailsViewContainerDeps;
        }

        this.deps.dropdownClickHandler = creator;

        return this;
    }

    public setAssessmentInstanceTableHandler(
        assessmentInstanceTableHandler: AssessmentInstanceTableHandler,
    ): DetailsViewContainerPropsBuilder {
        this.assessmentInstanceTableHandler = assessmentInstanceTableHandler;
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
            storeState: storeState,
        };

        return props;
    }
}
