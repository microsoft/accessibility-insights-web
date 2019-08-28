// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewData } from '../common/types/store-data/details-view-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { UnifiedStatusResults } from './components/cards/failed-instances-section-v2';
import { DetailsViewCommandBarDeps } from './components/details-view-command-bar';
import { DetailsRightPanelConfiguration, DetailsViewContentDeps } from './components/details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { IssuesTableHandler } from './components/issues-table-handler';
import { DetailsViewLeftNav, DetailsViewLeftNavDeps } from './components/left-nav/details-view-left-nav';
import { TabInfo } from './components/tab-info';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';

export type DetailsViewMainContentDeps = DetailsViewContentDeps & DetailsViewLeftNavDeps & DetailsViewCommandBarDeps;

export interface DetailsViewMainContentProps {
    deps: DetailsViewMainContentDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    detailsViewStoreData: DetailsViewData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    unifiedResults: UnifiedStatusResults;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    assessmentsProvider: AssessmentsProvider;
    dropdownClickHandler: DropdownClickHandler;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    issuesSelection: ISelection;
    issuesTableHandler: IssuesTableHandler;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
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
                dropdownClickHandler={this.props.dropdownClickHandler}
            />
        );
    }
}
