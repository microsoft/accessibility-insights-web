// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { StartOverComponentProps } from 'DetailsView/components/start-over-component';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { ReportExportComponent, ReportExportComponentDeps, ReportExportComponentProps } from './report-export-component';
import { StartOverDropdown } from './start-over-dropdown';

export type DetailsViewCommandBarDeps = ReportExportComponentDeps & {
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
    getDateFromTimestamp: (timestamp: string) => Date;
    reportExportComponentPropertyFactory: ReportExportComponentPropertyFactory;
    startOverComponentPropertyFactory: StartOverComponentPropertyFactory;
};

export type CommandBarProps = Omit<DetailsViewCommandBarProps, 'renderStartOver'>;

export type ReportExportComponentPropertyFactory = (props: CommandBarProps) => ReportExportComponentProps;

export type StartOverComponentPropertyFactory = (props: CommandBarProps) => StartOverComponentProps;

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: TabStoreData;
    actionMessageCreator: DetailsViewActionMessageCreator;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    visualizationScanResultData: VisualizationScanResultData;
    cardsViewData: CardsViewModel;
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
        const reportExportComponentProps = this.props.deps.reportExportComponentPropertyFactory(this.props);
        const startOverComponentProps = this.props.deps.startOverComponentPropertyFactory(this.props);

        if (!reportExportComponentProps || !startOverComponentProps || !startOverComponentProps.render) {
            return null;
        }

        const selectedTest = this.props.assessmentStoreData.assessmentNavState.selectedTestType;
        const test = this.props.assessmentsProvider.forType(selectedTest);

        return (
            <div className="details-view-command-buttons">
                <ReportExportComponent {...reportExportComponentProps} />
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
