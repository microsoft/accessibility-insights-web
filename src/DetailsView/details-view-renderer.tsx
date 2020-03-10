// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { ISelection } from 'office-ui-fabric-react';
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
import { DetailsView, DetailsViewContainerDeps } from './details-view-container';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';

export class DetailsViewRenderer {
    constructor(
        private readonly deps: DetailsViewContainerDeps,
        private readonly dom: Document,
        private readonly renderer: typeof ReactDOM.render,
        private readonly documentManipulator: DocumentManipulator,
    ) {}

    public render(): void {
        const detailsViewContainer = this.dom.querySelector('#details-container');
        const iconPath = '../' + config.getOption('icon128');
        this.documentManipulator.setShortcutIcon(iconPath);

        this.renderer(
            <>
                <Theme deps={this.deps} />
                <DetailsView deps={this.deps} />
            </>,
            detailsViewContainer,
        );
    }
}
