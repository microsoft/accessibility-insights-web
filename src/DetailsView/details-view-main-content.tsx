// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { IAssessmentsProvider } from '../assessments/types/iassessments-provider';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../common/types/store-data/iassessment-result-data';
import { IDetailsViewData } from '../common/types/store-data/idetails-view-data';
import { ITabStoreData } from '../common/types/store-data/itab-store-data';
import { IVisualizationScanResultData } from '../common/types/store-data/ivisualization-scan-result-data';
import { IVisualizationStoreData } from '../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DetailsViewCommandBarDeps } from './components/details-view-command-bar';
import { DetailsRightPanelConfiguration, DetailsViewContentDeps } from './components/details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { IssuesTableHandler } from './components/issues-table-handler';
import { DetailsViewLeftNav, DetailsViewLeftNavDeps } from './components/left-nav/details-view-left-nav';
import { TabInfo } from './components/tab-info';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { ReportGenerator } from './reports/report-generator';

export type DetailsViewMainContentDeps = DetailsViewContentDeps & DetailsViewLeftNavDeps & DetailsViewCommandBarDeps;

export interface DetailsViewMainContentProps {
    deps: DetailsViewMainContentDeps;
    tabStoreData: ITabStoreData;
    assessmentStoreData: IAssessmentStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    detailsViewStoreData: IDetailsViewData;
    selectedTest: VisualizationType;
    visualizationStoreData: IVisualizationStoreData;
    visualizationScanResultData: IVisualizationScanResultData;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    assessmentsProvider: IAssessmentsProvider;
    dropdownClickHandler: DropdownClickHandler;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    issuesSelection: ISelection;
    reportGenerator: ReportGenerator;
    issuesTableHandler: IssuesTableHandler;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    issueTrackerPath: string;
}

export class DetailsViewMainContent extends React.Component<DetailsViewMainContentProps> {
    public render(): JSX.Element {
        return (
            <>
                {this.renderCommandBar()}
                <div className="table row-layout details-view-main-content">
                    {this.renderNavBar()}
                    <div className="details-content table column-layout">
                        {this.getTabInfo(this.props.tabStoreData.isClosed)}
                        <div className="view" role="main">
                            <this.props.rightPanelConfiguration.RightPanel {...this.props} />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    private renderCommandBar(): JSX.Element {
        const { deps, switcherNavConfiguration } = this.props;
        return <switcherNavConfiguration.CommandBar actionMessageCreator={deps.detailsViewActionMessageCreator} {...this.props} />;
    }

    private renderNavBar(): JSX.Element {
        const tabClosed = this.props.tabStoreData.isClosed;

        if (tabClosed) {
            return null;
        }

        return <DetailsViewLeftNav {...this.props} />;
    }

    private getTabInfo(tabClosed: boolean): JSX.Element {
        if (tabClosed) {
            return null;
        }

        return (
            <TabInfo
                isTargetPageHidden={this.props.tabStoreData.isPageHidden}
                url={this.props.tabStoreData.url}
                title={this.props.tabStoreData.title}
                actionCreator={this.props.deps.detailsViewActionMessageCreator}
                selectedPivot={this.props.visualizationStoreData.selectedDetailsViewPivot}
                featureFlags={this.props.featureFlagStoreData}
                dropdownClickHandler={this.props.dropdownClickHandler}
            />
        );
    }
}
