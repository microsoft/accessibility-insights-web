// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Theme } from '../common/components/theme';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { config } from '../common/configuration';
import { DocumentManipulator } from '../common/document-manipulator';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { IssuesTableHandler } from './components/issues-table-handler';
import {
    DetailsView,
    DetailsViewContainerDeps,
} from './details-view-container';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';

export class DetailsViewRenderer {
    private renderer: typeof ReactDOM.render;
    private dom: Document;
    private scopingActionMessageCreator: ScopingActionMessageCreator;
    private inspectActionMessageCreator: InspectActionMessageCreator;
    private issuesSelection: ISelection;
    private clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private issuesTableHandler: IssuesTableHandler;
    private assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    private previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    private scopingFlagsHandler: PreviewFeatureFlagsHandler;
    private dropdownClickHandler: DropdownClickHandler;
    private assessmentsProvider: AssessmentsProvider;

    constructor(
        private readonly deps: DetailsViewContainerDeps,
        dom: Document,
        renderer: typeof ReactDOM.render,
        scopingActionMessageCreator: ScopingActionMessageCreator,
        inspectActionMessageCreator: InspectActionMessageCreator,
        issuesSelection: ISelection,
        clickHandlerFactory: DetailsViewToggleClickHandlerFactory,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        issuesTableHandler: IssuesTableHandler,
        assessmentInstanceTableHandler: AssessmentInstanceTableHandler,
        previewFeatureFlagsHandler: PreviewFeatureFlagsHandler,
        scopingFlagsHandler: PreviewFeatureFlagsHandler,
        dropdownClickHandler: DropdownClickHandler,
        assessmentsProvider: AssessmentsProvider,
        private documentManipulator: DocumentManipulator,
    ) {
        this.renderer = renderer;
        this.dom = dom;

        this.scopingActionMessageCreator = scopingActionMessageCreator;
        this.inspectActionMessageCreator = inspectActionMessageCreator;
        this.issuesSelection = issuesSelection;
        this.clickHandlerFactory = clickHandlerFactory;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;

        this.issuesTableHandler = issuesTableHandler;
        this.assessmentInstanceTableHandler = assessmentInstanceTableHandler;
        this.previewFeatureFlagsHandler = previewFeatureFlagsHandler;
        this.scopingFlagsHandler = scopingFlagsHandler;
        this.dropdownClickHandler = dropdownClickHandler;
        this.assessmentsProvider = assessmentsProvider;
    }

    public render(): void {
        const detailsViewContainer = this.dom.querySelector(
            '#details-container',
        );
        const iconPath = '../' + config.getOption('icon128');
        this.documentManipulator.setShortcutIcon(iconPath);
        this.renderer(
            <>
                <Theme deps={this.deps} />
                <DetailsView
                    deps={this.deps}
                    issuesSelection={this.issuesSelection}
                    clickHandlerFactory={this.clickHandlerFactory}
                    visualizationConfigurationFactory={
                        this.visualizationConfigurationFactory
                    }
                    issuesTableHandler={this.issuesTableHandler}
                    assessmentInstanceTableHandler={
                        this.assessmentInstanceTableHandler
                    }
                    previewFeatureFlagsHandler={this.previewFeatureFlagsHandler}
                    scopingFlagsHandler={this.scopingFlagsHandler}
                    dropdownClickHandler={this.dropdownClickHandler}
                    scopingActionMessageCreator={
                        this.scopingActionMessageCreator
                    }
                    inspectActionMessageCreator={
                        this.inspectActionMessageCreator
                    }
                    assessmentsProvider={this.assessmentsProvider}
                />
            </>,
            detailsViewContainer,
        );
    }
}
