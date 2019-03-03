// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { escape } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { ReportGenerator, ReportGeneratorDeps } from '../reports/report-generator';
import { ExportDialog, ExportDialogDeps } from './export-dialog';
import { StartOverDropdown } from './start-over-dropdown';

export type DetailsViewCommandBarDeps = ExportDialogDeps & ReportGeneratorDeps;

// tslint:disable-next-line:interface-name
export interface IDetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: ITabStoreData;
    actionMessageCreator: DetailsViewActionMessageCreator;
    assessmentStoreData: IAssessmentStoreData;
    assessmentsProvider: IAssessmentsProvider;
    reportGenerator: ReportGenerator;
    renderExportAndStartOver: boolean;
}

// tslint:disable-next-line:interface-name
export interface IDetailsViewCommandBarState {
    isExportDialogOpen: boolean;
    exportDialogDescription: string;
    exportHtmlWithPlaceholder: string;
    exportHtmlWithDescription: string;
}

export class DetailsViewCommandBar extends React.Component<IDetailsViewCommandBarProps, IDetailsViewCommandBarState> {
    constructor(props) {
        super(props);
        this.state = {
            isExportDialogOpen: false,
            exportDialogDescription: '',
            exportHtmlWithPlaceholder: '',
            exportHtmlWithDescription: '',
        };
    }

    public render(): JSX.Element {
        const shouldRender = !this.props.tabStoreData.isClosed && this.props.featureFlagStoreData[FeatureFlags.newAssessmentExperience];
        if (!shouldRender) {
            return null;
        }

        return (
            <div className="details-view-command-bar">
                {this.renderTargetPageInfo()}
                {this.renderCommandButtons()}
            </div>
        );
    }

    private renderTargetPageInfo(): JSX.Element {
        const targetPageTitle: string = this.props.tabStoreData.title;
        return (
            <div className="details-view-target-page">
                Target page:&nbsp;
                <Link
                    role="link"
                    title="Switch to target page"
                    className="target-page-link"
                    onClick={this.props.actionMessageCreator.switchToTargetTab}
                >
                    {targetPageTitle}
                </Link>
            </div>
        );
    }

    private renderCommandButtons(): JSX.Element {
        if (!this.props.renderExportAndStartOver) {
            return null;
        }

        const selectedTest = this.props.assessmentStoreData.assessmentNavState.selectedTestType;
        const test = this.props.assessmentsProvider.forType(selectedTest);

        return (
            <div className="details-view-command-buttons">
                <ActionButton iconProps={{ iconName: 'Export' }} onClick={this.onExportButtonClick}>
                    Export result
                </ActionButton>
                <StartOverDropdown
                    testName={test.title}
                    test={selectedTest}
                    requirementKey={this.props.assessmentStoreData.assessmentNavState.selectedTestStep}
                    actionMessageCreator={this.props.actionMessageCreator}
                />
                <ExportDialog
                    deps={this.props.deps}
                    isOpen={this.state.isExportDialogOpen}
                    description={this.state.exportDialogDescription}
                    html={this.state.exportHtmlWithDescription}
                    onClose={this.onExportDialogClose}
                    onDescriptionChange={this.onExportDialogDescriptionChanged}
                    exportResultsType="Assessment"
                />
            </div>
        );
    }

    private descriptionPlaceholder: string = '7efdac3c-8c94-4e00-a765-6fc8c59a232b';

    @autobind
    private onExportButtonClick(): void {
        const exportHtmlWithPlaceholder = this.props.reportGenerator.generateAssessmentHtml(
            this.props.deps,
            this.props.assessmentStoreData,
            this.props.assessmentsProvider,
            this.props.featureFlagStoreData,
            this.props.tabStoreData,
            this.descriptionPlaceholder,
        );

        const description = '';
        const exportHtmlWithDescription = exportHtmlWithPlaceholder.replace(this.descriptionPlaceholder, description);

        this.setState({
            isExportDialogOpen: true,
            exportDialogDescription: description,
            exportHtmlWithPlaceholder: exportHtmlWithPlaceholder,
            exportHtmlWithDescription: exportHtmlWithDescription,
        });
    }

    @autobind
    private onExportDialogClose(): void {
        this.setState({
            isExportDialogOpen: false,
        });
    }

    @autobind
    private onExportDialogDescriptionChanged(description: string): void {
        const escapedDescription = escape(description);
        const exportHtmlWithDescription = this.state.exportHtmlWithPlaceholder.replace(this.descriptionPlaceholder, escapedDescription);

        this.setState({
            exportDialogDescription: description,
            exportHtmlWithDescription: exportHtmlWithDescription,
        });
    }
}
