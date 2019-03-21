// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';

import { IAssessmentsProvider } from '../../../../assessments/types/iassessments-provider';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../../../../common/dropdown-click-handler';
import { IBaseStore } from '../../../../common/istore';
import { InspectActionMessageCreator } from '../../../../common/message-creators/inspect-action-message-creator';
import { IStoreActionMessageCreator } from '../../../../common/message-creators/istore-action-message-creator';
import { ScopingActionMessageCreator } from '../../../../common/message-creators/scoping-action-message-creator';
import { BaseClientStoresHub } from '../../../../common/stores/base-client-stores-hub';
import { IAssessmentStoreData } from '../../../../common/types/store-data/iassessment-result-data';
import { IDetailsViewData } from '../../../../common/types/store-data/idetails-view-data';
import { ITabStoreData } from '../../../../common/types/store-data/itab-store-data';
import { IVisualizationScanResultData } from '../../../../common/types/store-data/ivisualization-scan-result-data';
import { IVisualizationStoreData } from '../../../../common/types/store-data/ivisualization-store-data';
import { IScopingStoreData } from '../../../../common/types/store-data/scoping-store-data';
import { IssuesTableHandler } from '../../../../DetailsView/components/issues-table-handler';
import { DetailsViewContainerDeps, DetailsViewContainerProps } from '../../../../DetailsView/details-view-container';
import { AssessmentInstanceTableHandler } from '../../../../DetailsView/handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from '../../../../DetailsView/handlers/preview-feature-flags-handler';
import { DictionaryStringTo } from '../../../../types/common-types';
import { StoreMocks } from './store-mocks';

export class DetailsViewContainerPropsBuilder {
    private visualizationStore: IBaseStore<IVisualizationStoreData>;
    private assessmentStore: IBaseStore<IAssessmentStoreData>;
    private visualizationScanResultStore: IBaseStore<IVisualizationScanResultData>;
    private tabStore: IBaseStore<ITabStoreData>;
    private featureFlagStore: IBaseStore<DictionaryStringTo<boolean>>;
    private scopingStateStore: IBaseStore<IScopingStoreData>;
    private detailsViewStore: IBaseStore<IDetailsViewData>;
    private scopingActionMessageCreator: ScopingActionMessageCreator;
    private inspectActionMessageCreator: InspectActionMessageCreator;
    private storeActionCreator: IStoreActionMessageCreator;
    private document: Document = document;
    private issuesSelection: ISelection;
    private clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    private issuesTableHandler: IssuesTableHandler;
    private previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    private scopingFlagsHandler: PreviewFeatureFlagsHandler;
    private dropdownClickHandler: DropdownClickHandler;
    private assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    private assessmentProvider: IAssessmentsProvider;
    private configFactory: VisualizationConfigurationFactory;
    private storesHub: BaseClientStoresHub<any>;
    constructor(private deps: DetailsViewContainerDeps) {}

    public setDetailsViewStoreActionMessageCreator(creator: IStoreActionMessageCreator): DetailsViewContainerPropsBuilder {
        this.storeActionCreator = creator;
        return this;
    }

    public setAssessmentProvider(provider: IAssessmentsProvider): DetailsViewContainerPropsBuilder {
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

    public setStoreActionMessageCreator(creator: IStoreActionMessageCreator): DetailsViewContainerPropsBuilder {
        this.storeActionCreator = creator;
        return this;
    }

    public setDropdownClickHandler(creator: DropdownClickHandler): DetailsViewContainerPropsBuilder {
        this.dropdownClickHandler = creator;
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
                this.visualizationStore,
                this.assessmentStore,
                this.scopingStateStore,
            ]);

        const storeState = this.storesHub ? this.storesHub.getAllStoreData() : null;
        if (this.deps !== null) {
            this.deps.storesHub = storesHub;
            this.deps.storeActionMessageCreator = this.storeActionCreator;
        }

        return {
            deps: this.deps,
            document: this.document,
            issuesSelection: this.issuesSelection,
            clickHandlerFactory: this.clickHandlerFactory,
            visualizationConfigurationFactory: this.configFactory,
            issuesTableHandler: this.issuesTableHandler,
            reportGenerator: null,
            previewFeatureFlagsHandler: this.previewFeatureFlagsHandler,
            scopingFlagsHandler: this.scopingFlagsHandler,
            dropdownClickHandler: this.dropdownClickHandler,
            assessmentInstanceTableHandler: this.assessmentInstanceTableHandler,
            scopingActionMessageCreator: this.scopingActionMessageCreator,
            inspectActionMessageCreator: this.inspectActionMessageCreator,
            assessmentsProvider: this.assessmentProvider,
            storeState: storeState,
        };
    }
}
