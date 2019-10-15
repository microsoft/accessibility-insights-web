// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';

import { ThemeDeps } from '../common/components/theme';
import { withStoreSubscription, WithStoreSubscriptionDeps } from '../common/components/with-store-subscription';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { GetUnifiedRuleResultsDelegate } from '../common/rule-based-view-model-provider';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewData } from '../common/types/store-data/details-view-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from '../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DetailsViewCommandBarDeps } from './components/details-view-command-bar';
import { DetailsViewOverlay, DetailsViewOverlayDeps } from './components/details-view-overlay';
import { DetailsRightPanelConfiguration, GetDetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { Header, HeaderDeps } from './components/header';
import { IssuesTableHandler } from './components/issues-table-handler';
import { TargetChangeDialogDeps } from './components/target-change-dialog';
import { TargetPageClosedView } from './components/target-page-closed-view';
import { DetailsViewBody, DetailsViewBodyDeps } from './details-view-body';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';

export type DetailsViewContainerDeps = {
    getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration;
    getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration;
    getUnifiedRuleResults: GetUnifiedRuleResultsDelegate;
} & DetailsViewBodyDeps &
    DetailsViewOverlayDeps &
    DetailsViewCommandBarDeps &
    HeaderDeps &
    WithStoreSubscriptionDeps<DetailsViewContainerState> &
    ThemeDeps &
    TargetChangeDialogDeps;

export interface DetailsViewContainerProps {
    deps: DetailsViewContainerDeps;
    issuesSelection: ISelection;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    issuesTableHandler: IssuesTableHandler;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    scopingFlagsHandler: PreviewFeatureFlagsHandler;
    dropdownClickHandler: DropdownClickHandler;
    assessmentsProvider: AssessmentsProvider;
    storeState: DetailsViewContainerState;
}

export interface DetailsViewContainerState {
    visualizationStoreData: VisualizationStoreData;
    tabStoreData: TabStoreData;
    visualizationScanResultStoreData: VisualizationScanResultData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    detailsViewStoreData: DetailsViewData;
    assessmentStoreData: AssessmentStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    scopingPanelStateStoreData: ScopingStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    selectedDetailsView: VisualizationType;
    selectedDetailsRightPanelConfiguration: DetailsRightPanelConfiguration;
    cardSelectionStoreData: CardSelectionStoreData;
}

export class DetailsViewContainer extends React.Component<DetailsViewContainerProps> {
    private initialRender: boolean = true;

    public render(): JSX.Element {
        if (this.isTargetPageClosed()) {
            return (
                <div className="table column-layout main-wrapper">
                    {this.renderHeader()}
                    <TargetPageClosedView />
                </div>
            );
        }

        if (!this.props.deps.storesHub.hasStoreData()) {
            return this.renderSpinner();
        }

        if (this.initialRender) {
            this.props.deps.detailsViewActionMessageCreator.detailsViewOpened(
                this.props.storeState.visualizationStoreData.selectedDetailsViewPivot,
            );
            this.initialRender = false;
        }

        return this.renderContent();
    }

    private isTargetPageClosed(): boolean {
        return !this.hasStores() || (this.props.deps.storesHub.hasStoreData() && this.props.storeState.tabStoreData.isClosed);
    }

    private renderSpinner(): JSX.Element {
        return <Spinner className="details-view-spinner" size={SpinnerSize.large} label="Loading..." />;
    }

    private renderContent(): JSX.Element {
        return (
            <div className="table column-layout main-wrapper">
                {this.renderHeader()}
                {this.renderDetailsView()}
                {this.renderOverlay()}
            </div>
        );
    }

    private renderHeader(): JSX.Element {
        const storeState = this.props.storeState;
        const visualizationStoreData = storeState ? storeState.visualizationStoreData : null;
        return (
            <Header
                deps={this.props.deps}
                selectedPivot={visualizationStoreData ? visualizationStoreData.selectedDetailsViewPivot : null}
                featureFlagStoreData={this.hasStores() ? storeState.featureFlagStoreData : null}
                dropdownClickHandler={this.props.dropdownClickHandler}
                tabClosed={this.hasStores() ? this.props.storeState.tabStoreData.isClosed : true}
            />
        );
    }

    private renderOverlay(): JSX.Element {
        const { deps, storeState } = this.props;
        return (
            <DetailsViewOverlay
                deps={deps}
                actionMessageCreator={this.props.deps.detailsViewActionMessageCreator}
                previewFeatureFlagsHandler={this.props.previewFeatureFlagsHandler}
                scopingActionMessageCreator={this.props.scopingActionMessageCreator}
                inspectActionMessageCreator={this.props.inspectActionMessageCreator}
                detailsViewStoreData={storeState.detailsViewStoreData}
                scopingStoreData={storeState.scopingPanelStateStoreData}
                featureFlagStoreData={storeState.featureFlagStoreData}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
            />
        );
    }

    private renderDetailsView(): JSX.Element {
        const { deps, storeState } = this.props;
        const selectedDetailsRightPanelConfiguration = this.props.deps.getDetailsRightPanelConfiguration({
            selectedDetailsViewPivot: storeState.visualizationStoreData.selectedDetailsViewPivot,
            detailsViewRightContentPanel: storeState.detailsViewStoreData.detailsViewRightContentPanel,
        });
        const selectedDetailsViewSwitcherNavConfiguration = this.props.deps.getDetailsSwitcherNavConfiguration({
            selectedDetailsViewPivot: storeState.visualizationStoreData.selectedDetailsViewPivot,
        });
        const selectedTest = selectedDetailsViewSwitcherNavConfiguration.getSelectedDetailsView(storeState);

        const ruleResults = this.props.deps.getUnifiedRuleResults(
            this.props.storeState.unifiedScanResultStoreData.rules,
            this.props.storeState.unifiedScanResultStoreData.results,
        );

        return (
            <DetailsViewBody
                deps={deps}
                tabStoreData={storeState.tabStoreData}
                assessmentStoreData={storeState.assessmentStoreData}
                pathSnippetStoreData={storeState.pathSnippetStoreData}
                featureFlagStoreData={storeState.featureFlagStoreData}
                selectedTest={selectedTest}
                detailsViewStoreData={storeState.detailsViewStoreData}
                visualizationStoreData={storeState.visualizationStoreData}
                visualizationScanResultData={storeState.visualizationScanResultStoreData}
                visualizationConfigurationFactory={this.props.visualizationConfigurationFactory}
                assessmentsProvider={this.props.assessmentsProvider}
                dropdownClickHandler={this.props.dropdownClickHandler}
                clickHandlerFactory={this.props.clickHandlerFactory}
                assessmentInstanceTableHandler={this.props.assessmentInstanceTableHandler}
                issuesSelection={this.props.issuesSelection}
                issuesTableHandler={this.props.issuesTableHandler}
                rightPanelConfiguration={selectedDetailsRightPanelConfiguration}
                switcherNavConfiguration={selectedDetailsViewSwitcherNavConfiguration}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
                ruleResultsByStatus={ruleResults}
                targetAppInfo={storeState.unifiedScanResultStoreData.targetAppInfo}
                cardSelectionStoreData={storeState.cardSelectionStoreData}
            />
        );
    }

    private hasStores(): boolean {
        return this.props.deps !== null && this.props.deps.storesHub !== null && this.props.deps.storesHub.hasStores();
    }
}

export const DetailsView = withStoreSubscription<DetailsViewContainerProps, DetailsViewContainerState>(DetailsViewContainer);
