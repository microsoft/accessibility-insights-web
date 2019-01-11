// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IAssessmentsProvider } from '../assessments/types/iassessments-provider';
import { PivotConfiguration } from '../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { config } from '../common/configuration';
import { DocumentManipulator } from '../common/document-manipulator';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { IStoreActionMessageCreator } from '../common/message-creators/istore-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { IClientStoresHub } from '../common/stores/iclient-stores-hub';
import { IssuesTableHandler } from './components/issues-table-handler';
import { DetailsViewContainerDeps, IDetailsViewContainerState, IDetailsViewContainerProps, DetailsViewContainer, DetailsView } from './details-view-container';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';
import { ReportGenerator } from './reports/report-generator';
import { withStoreSubscription } from '../common/components/with-store-subscription';

export interface IDetailsViewRenderer {
    render(backgroundConnection: chrome.runtime.Port, tabId: number): void;
}

export class DetailsViewRenderer implements IDetailsViewRenderer {
    private renderer: typeof ReactDOM.render;
    private dom: NodeSelector & Node;
    private scopingActionMessageCreator: ScopingActionMessageCreator;
    private inspectActionMessageCreator: InspectActionMessageCreator;
    private detailsViewStoreActionCreator: IStoreActionMessageCreator;
    private issuesSelection: ISelection;
    private clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    private pivotConfiguration: PivotConfiguration;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private storesHub: IClientStoresHub<IDetailsViewContainerState>;
    private issuesTableHandler: IssuesTableHandler;
    private assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    private reportGenerator: ReportGenerator;
    private previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    private scopingFlagsHandler: PreviewFeatureFlagsHandler;
    private dropdownClickHandler: DropdownClickHandler;
    private assessmentsProvider: IAssessmentsProvider;

    constructor(
        private readonly deps: DetailsViewContainerDeps,
        dom: NodeSelector & Node,
        renderer: typeof ReactDOM.render,
        scopingActionMessageCreator: ScopingActionMessageCreator,
        inspectActionMessageCreator: InspectActionMessageCreator,
        detailsViewStoreActionCreator: IStoreActionMessageCreator,
        issuesSelection: ISelection,
        clickHandlerFactory: DetailsViewToggleClickHandlerFactory,
        pivotConfiguration: PivotConfiguration,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        storesHub: IClientStoresHub<IDetailsViewContainerState>,
        issuesTableHandler: IssuesTableHandler,
        assessmentInstanceTableHandler: AssessmentInstanceTableHandler,
        reportGenerator: ReportGenerator,
        previewFeatureFlagsHandler: PreviewFeatureFlagsHandler,
        scopingFlagsHandler: PreviewFeatureFlagsHandler,
        dropdownClickHandler: DropdownClickHandler,
        assessmentsProvider: IAssessmentsProvider,
        private documentManipulator: DocumentManipulator,
    ) {
        this.renderer = renderer;
        this.dom = dom;

        this.scopingActionMessageCreator = scopingActionMessageCreator;
        this.inspectActionMessageCreator = inspectActionMessageCreator;
        this.detailsViewStoreActionCreator = detailsViewStoreActionCreator;
        this.issuesSelection = issuesSelection;
        this.clickHandlerFactory = clickHandlerFactory;
        this.pivotConfiguration = pivotConfiguration;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;

        this.storesHub = storesHub;
        this.issuesTableHandler = issuesTableHandler;
        this.assessmentInstanceTableHandler = assessmentInstanceTableHandler;
        this.reportGenerator = reportGenerator;
        this.previewFeatureFlagsHandler = previewFeatureFlagsHandler;
        this.scopingFlagsHandler = scopingFlagsHandler;
        this.dropdownClickHandler = dropdownClickHandler;
        this.assessmentsProvider = assessmentsProvider;
    }

    public render() {
        const detailsViewContainer = this.dom.querySelector('#details-container');
        const iconPath = '../' + config.getOption('icon16');
        this.documentManipulator.setShortcutIcon(iconPath);
        this.renderer(
            <DetailsView
                deps={this.deps}
                document={this.dom as Document}
                issuesSelection={this.issuesSelection}
                clickHandlerFactory={this.clickHandlerFactory}
                storeActionCreator={this.detailsViewStoreActionCreator}
                pivotConfiguration={this.pivotConfiguration}
                visualizationConfigurationFactory={this.visualizationConfigurationFactory}
                storesHub={this.storesHub}
                issuesTableHandler={this.issuesTableHandler}
                assessmentInstanceTableHandler={this.assessmentInstanceTableHandler}
                reportGenerator={this.reportGenerator}
                previewFeatureFlagsHandler={this.previewFeatureFlagsHandler}
                scopingFlagsHandler={this.scopingFlagsHandler}
                dropdownClickHandler={this.dropdownClickHandler}
                scopingActionMessageCreator={this.scopingActionMessageCreator}
                inspectActionMessageCreator={this.inspectActionMessageCreator}
                assessmentsProvider={this.assessmentsProvider}
                storeState={null}
            />,
            detailsViewContainer,
        );
    }
}
