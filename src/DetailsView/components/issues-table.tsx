// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

import { UnifiedStatusResults } from '../../common/components/cards/failed-instances-section';
import { FlaggedComponent } from '../../common/components/flagged-component';
import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { VisualizationType } from '../../common/types/visualization-type';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';
import { RuleResult, ScanResults } from '../../scanner/iruleresults';
import { DictionaryStringTo } from '../../types/common-types';
import { CardsView, CardsViewDeps } from './cards-view';
import { ExportDialogDeps } from './export-dialog';
import { IssuesDetailsList } from './issues-details-list';
import { IssuesDetailsPane, IssuesDetailsPaneDeps } from './Issues-details-pane';
import { IssuesTableHandler } from './issues-table-handler';
import { ReportExportComponent } from './report-export-component';

export type IssuesTableDeps = IssuesDetailsPaneDeps &
    CardsViewDeps &
    ExportDialogDeps & {
        getDateFromTimestamp: (timestamp: string) => Date;
        reportGenerator: ReportGenerator;
    };

export interface IssuesTableProps {
    deps: IssuesTableDeps;
    title: string;
    subtitle?: JSX.Element;
    issuesTableHandler: IssuesTableHandler;
    violations: RuleResult[];
    selectedIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult>;
    issuesEnabled: boolean;
    issuesSelection: ISelection;
    pageTitle: string;
    pageUrl: string;
    scanning: boolean;
    toggleClickHandler: (event) => void;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    featureFlags: FeatureFlagStoreData;
    scanResult: ScanResults;
    userConfigurationStoreData: UserConfigurationStoreData;
    ruleResultsByStatus: UnifiedStatusResults;
}

export class IssuesTable extends React.Component<IssuesTableProps> {
    private configuration: VisualizationConfiguration;
    public static readonly exportTextareaLabel: string = 'Provide result description';
    public static readonly exportInstructions: string = 'Optional: please describe the result (it will be saved in the report).';

    constructor(props: IssuesTableProps) {
        super(props);
        this.configuration = props.visualizationConfigurationFactory.getConfiguration(VisualizationType.Issues);
    }

    public render(): JSX.Element {
        return (
            <div className="issues-table">
                <h1>{this.props.title}</h1>
                {this.renderSubtitle()}
                {this.renderContent()}
            </div>
        );
    }

    private renderSubtitle(): JSX.Element {
        if (!this.props.subtitle) {
            return null;
        }
        return <div className="issues-table-subtitle">{this.props.subtitle}</div>;
    }

    private renderContent(): JSX.Element {
        if (this.props.issuesEnabled == null) {
            return this.renderSpinner('Loading...');
        }

        return (
            <div className="issues-table-content">
                {this.renderCommandBar()}
                {this.renderComponent()}
            </div>
        );
    }

    private renderCommandBar(): JSX.Element {
        return (
            <div className="details-view-command-bar">
                {this.renderToggle()}
                {this.renderExportButton()}
            </div>
        );
    }

    private nullUpdatePersistedDescription(value: string): void {}

    private getEmptyExportDescription = () => '';

    private renderExportButton(): JSX.Element {
        const shouldShowButton = this.props.issuesEnabled && !this.props.scanning;

        if (shouldShowButton) {
            const { deps, scanResult, pageTitle, pageUrl } = this.props;
            const scanDate = deps.getDateFromTimestamp(scanResult.timestamp);
            const reportGenerator = deps.reportGenerator;
            return (
                <ReportExportComponent
                    deps={deps}
                    scanDate={scanDate}
                    reportGenerator={reportGenerator}
                    pageTitle={pageTitle}
                    exportResultsType={'AutomatedChecks'}
                    htmlGenerator={reportGenerator.generateFastPassAutomateChecksReport.bind(
                        reportGenerator,
                        scanResult,
                        scanDate,
                        pageTitle,
                        pageUrl,
                        this.props.ruleResultsByStatus,
                    )}
                    updatePersistedDescription={this.nullUpdatePersistedDescription}
                    getExportDescription={this.getEmptyExportDescription}
                />
            );
        } else {
            return null;
        }
    }

    private renderComponent(): JSX.Element {
        if (!this.props.issuesEnabled) {
            return this.renderDisabledMessage();
        }

        if (this.props.scanning) {
            return this.renderSpinner('Scanning...');
        }

        if (this.props.violations == null) {
            return this.renderSpinner('Loading data...');
        }

        return (
            <FlaggedComponent
                disableJSXElement={this.renderDetails()}
                enableJSXElement={
                    <CardsView
                        deps={this.props.deps}
                        ruleResultsByStatus={this.props.ruleResultsByStatus}
                        userConfigurationStoreData={this.props.userConfigurationStoreData}
                    />
                }
                featureFlag={FeatureFlags.universalCardsUI}
                featureFlagStoreData={this.props.featureFlags}
            />
        );
    }

    private renderToggle(): JSX.Element {
        return (
            <VisualizationToggle
                label={this.configuration.displayableData.toggleLabel}
                checked={this.props.issuesEnabled}
                disabled={this.props.scanning}
                onClick={this.props.toggleClickHandler}
                className="automated-checks-details-view-toggle"
                visualizationName={this.configuration.displayableData.title}
            />
        );
    }

    private renderSpinner(label: string): JSX.Element {
        return <Spinner className="details-view-spinner" size={SpinnerSize.large} label={label} />;
    }

    private renderDisabledMessage(): JSX.Element {
        return (
            <div className="details-disabled-message" role="alert">
                Turn on <Markup.Term>{this.configuration.displayableData.title}</Markup.Term> to see a list of failures.
            </div>
        );
    }

    private renderDetails(): JSX.Element {
        return (
            <div className="issues-table-details">
                <IssuesDetailsList
                    violations={this.props.violations}
                    issuesTableHandler={this.props.issuesTableHandler}
                    issuesSelection={this.props.issuesSelection}
                />
                <div className="issue-detail-outer-container ms-Fabric">{this.getIssueDetailPane()}</div>
            </div>
        );
    }

    private getIssueDetailPane(): JSX.Element {
        return (
            <IssuesDetailsPane
                deps={this.props.deps}
                selectedIdToRuleResultMap={this.props.selectedIdToRuleResultMap}
                pageTitle={this.props.pageTitle}
                pageUrl={this.props.pageUrl}
                featureFlagData={this.props.featureFlags}
                userConfigurationStoreData={this.props.userConfigurationStoreData}
            />
        );
    }
}
