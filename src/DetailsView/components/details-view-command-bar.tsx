// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { ReportGenerator, ReportGeneratorDeps } from '../reports/report-generator';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { ExportControl } from './export-control';
import { ExportDialogDeps } from './export-dialog';
import { StartOverDropdown } from './start-over-dropdown';

export type DetailsViewCommandBarDeps = ExportDialogDeps &
    ReportGeneratorDeps & {
        dateProvider: () => Date;
    };

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: TabStoreData;
    actionMessageCreator: DetailsViewActionMessageCreator;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    reportGenerator: ReportGenerator;
    renderExportAndStartOver: boolean;
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

    private renderCommandButtons(): JSX.Element {
        if (!this.props.renderExportAndStartOver) {
            return null;
        }
        const { deps, assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData, reportGenerator } = this.props;
        const selectedTest = this.props.assessmentStoreData.assessmentNavState.selectedTestType;
        const test = this.props.assessmentsProvider.forType(selectedTest);
        const htmlGenerator = reportGenerator.generateAssessmentHtml.bind(
            reportGenerator,
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            tabStoreData,
        );

        return (
            <div className="details-view-command-buttons">
                <ExportControl
                    deps={deps}
                    reportGenerator={reportGenerator}
                    pageTitle={tabStoreData.title}
                    exportResultsType={'Assessment'}
                    scanDate={deps.dateProvider()}
                    htmlGenerator={htmlGenerator}
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
