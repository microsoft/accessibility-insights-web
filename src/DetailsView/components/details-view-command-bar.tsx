// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { ReportExportComponent, ReportExportComponentDeps } from './report-export-component';
import { StartOverDropdown } from './start-over-dropdown';

export type DetailsViewCommandBarDeps = ReportExportComponentDeps & {
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
};

export type CommandBarProps = Omit<DetailsViewCommandBarProps, 'renderExport' | 'renderStartOver'>;

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: TabStoreData;
    actionMessageCreator: DetailsViewActionMessageCreator;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    renderExport: boolean;
    renderStartOver: boolean;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
}

export class DetailsViewCommandBar extends React.Component<DetailsViewCommandBarProps> {
    public render(): JSX.Element {
        if (this.props.tabStoreData.isClosed) {
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
                    className={css('insights-link', 'target-page-link')}
                    onClick={this.props.actionMessageCreator.switchToTargetTab}
                >
                    {targetPageTitle}
                </Link>
            </div>
        );
    }

    private updatePersistedDescription = (value: string) => {
        this.props.actionMessageCreator.addResultDescription(value);
    };

    private getExportDescription = () => {
        return this.props.assessmentStoreData.resultDescription;
    };

    private renderCommandButtons(): JSX.Element {
        if (!this.props.renderExport && !this.props.renderStartOver) {
            return null;
        }
        const { deps, assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData } = this.props;
        const reportGenerator = deps.reportGenerator;
        const selectedTest = this.props.assessmentStoreData.assessmentNavState.selectedTestType;
        const test = this.props.assessmentsProvider.forType(selectedTest);
        const htmlGenerator = reportGenerator.generateAssessmentReport.bind(
            reportGenerator,
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            tabStoreData,
        );

        // TODO : break these into 2 pieces
        return (
            <div className="details-view-command-buttons">
                <ReportExportComponent
                    deps={deps}
                    reportGenerator={reportGenerator}
                    pageTitle={tabStoreData.title}
                    exportResultsType={'Assessment'}
                    scanDate={deps.getCurrentDate()}
                    htmlGenerator={htmlGenerator}
                    updatePersistedDescription={this.updatePersistedDescription}
                    getExportDescription={this.getExportDescription}
                />
                <StartOverDropdown
                    testName={test.title}
                    test={selectedTest}
                    requirementKey={this.props.assessmentStoreData.assessmentNavState.selectedTestStep}
                    actionMessageCreator={this.props.actionMessageCreator}
                    rightPanelConfiguration={this.props.rightPanelConfiguration}
                />
            </div>
        );
    }
}
