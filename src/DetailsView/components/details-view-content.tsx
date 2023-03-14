// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { GetCardSelectionViewData } from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { InspectActionMessageCreator } from 'common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from 'common/message-creators/scoping-action-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { GetCardViewData } from 'common/rule-based-view-model-provider';
import { convertStoreDataForScanNodeResults } from 'common/store-data-to-scan-node-result-converter';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { CardViewResultsHandler } from 'DetailsView/components/card-view-results-handler';
import {
    DetailsViewOverlay,
    DetailsViewOverlayDeps,
} from 'DetailsView/components/details-view-overlay/details-view-overlay';
import { GetDetailsRightPanelConfiguration } from 'DetailsView/components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import {
    InteractiveHeader,
    InteractiveHeaderDeps,
} from 'DetailsView/components/interactive-header';
import { IssuesTableHandler } from 'DetailsView/components/issues-table-handler';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { TestViewContainerProvider } from 'DetailsView/components/test-view-container-provider';
import { DetailsViewBody, DetailsViewBodyDeps } from 'DetailsView/details-view-body';
import { DetailsViewContainerProps } from 'DetailsView/details-view-container';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from 'DetailsView/handlers/preview-feature-flags-handler';
import * as React from 'react';

export type DetailsViewContentDeps = {
    getDateFromTimestamp: (timestamp: string) => Date;
    getAssessmentInstanceTableHandler: () => AssessmentInstanceTableHandler;
    getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration;
    getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration;
    getCardViewData: GetCardViewData;
    getCardSelectionViewData: GetCardSelectionViewData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    issuesTableHandler: IssuesTableHandler;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    dropdownClickHandler: DropdownClickHandler;
    isResultHighlightUnavailable: IsResultHighlightUnavailable;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    testViewContainerProvider: TestViewContainerProvider;
    cardViewResultsHandler: CardViewResultsHandler;
} & InteractiveHeaderDeps &
    DetailsViewOverlayDeps &
    DetailsViewBodyDeps;

export type DetailsViewContentProps = {
    deps: DetailsViewContentDeps;
    isSideNavOpen: boolean;
    setSideNavOpen: (isOpen: boolean, event?: React.MouseEvent<any>) => void;
    narrowModeStatus: NarrowModeStatus;
} & DetailsViewContainerProps;

export const DetailsViewContent = NamedFC<DetailsViewContentProps>('DetailsViewContent', props => {
    const selectedDetailsViewSwitcherNavConfiguration =
        props.deps.getDetailsSwitcherNavConfiguration({
            selectedDetailsViewPivot:
                props.storeState.visualizationStoreData.selectedDetailsViewPivot,
        });

    const renderHeader = () => {
        const storeState = props.storeState;
        const visualizationStoreData = storeState.visualizationStoreData;

        return (
            <InteractiveHeader
                deps={props.deps}
                selectedPivot={visualizationStoreData.selectedDetailsViewPivot}
                featureFlagStoreData={storeState.featureFlagStoreData}
                tabClosed={props.storeState.tabStoreData.isClosed}
                navMenu={selectedDetailsViewSwitcherNavConfiguration.leftNavHamburgerButton}
                isSideNavOpen={props.isSideNavOpen}
                setSideNavOpen={props.setSideNavOpen}
                narrowModeStatus={props.narrowModeStatus}
            />
        );
    };

    const renderOverlay = () => {
        const { deps, storeState } = props;
        return (
            <DetailsViewOverlay
                deps={deps}
                previewFeatureFlagsHandler={props.deps.previewFeatureFlagsHandler}
                scopingActionMessageCreator={props.deps.scopingActionMessageCreator}
                inspectActionMessageCreator={props.deps.inspectActionMessageCreator}
                detailsViewStoreData={storeState.detailsViewStoreData}
                scopingStoreData={storeState.scopingPanelStateStoreData}
                featureFlagStoreData={storeState.featureFlagStoreData}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
            />
        );
    };

    const renderDetailsView = () => {
        const { deps, storeState } = props;
        const selectedDetailsRightPanelConfiguration = props.deps.getDetailsRightPanelConfiguration(
            {
                selectedDetailsViewPivot:
                    storeState.visualizationStoreData.selectedDetailsViewPivot,
                detailsViewRightContentPanel:
                    storeState.detailsViewStoreData.detailsViewRightContentPanel,
            },
        );

        const selectedTest =
            selectedDetailsViewSwitcherNavConfiguration.getSelectedDetailsView(storeState);

        const automatedChecksCardsViewData = props.deps.getCardViewData(
            props.storeState.unifiedScanResultStoreData,
            props.deps.getCardSelectionViewData(
                props.storeState.cardSelectionStoreData,
                props.storeState.unifiedScanResultStoreData.results,
                props.storeState.unifiedScanResultStoreData.platformInfo,
                props.deps.isResultHighlightUnavailable,
            ),
        );

        const tabStopRequirementData =
            props.storeState.visualizationScanResultStoreData.tabStops.requirements;

        const needsReviewCardsViewData = props.deps.getCardViewData(
            props.storeState.needsReviewScanResultStoreData,
            props.deps.getCardSelectionViewData(
                props.storeState.needsReviewCardSelectionStoreData,
                props.storeState.needsReviewScanResultStoreData.results,
                props.storeState.needsReviewScanResultStoreData.platformInfo,
                props.deps.isResultHighlightUnavailable,
            ),
        );

        const assessmentCardsViewData = props.deps.getCardViewData(
            props.storeState.assessmentStoreData,
            props.deps.getCardSelectionViewData(
                props.storeState.assessmentCardSelectionStoreData[selectedTest],
                convertStoreDataForScanNodeResults(props.storeState.assessmentStoreData),
                null,
                props.deps.isResultHighlightUnavailable,
            ),
        );

        const targetAppInfo = {
            name: props.storeState.tabStoreData.title,
            url: props.storeState.tabStoreData.url,
        };

        const scanDate = props.deps.getDateFromTimestamp(
            props.storeState.unifiedScanResultStoreData.timestamp,
        );

        const scanMetadata: ScanMetadata = {
            timespan: {
                scanComplete: scanDate,
            },
            targetAppInfo: targetAppInfo,
            toolData: props.storeState.unifiedScanResultStoreData.toolInfo,
        };

        const assessmentInstanceTableHandler = props.deps.getAssessmentInstanceTableHandler();
        const assessmentStoreData =
            selectedDetailsViewSwitcherNavConfiguration.getSelectedAssessmentStoreData(
                props.storeState,
            );

        const overviewHeadingIntroText =
            selectedDetailsViewSwitcherNavConfiguration.overviewHeadingIntroText;
        const linkDataSource = selectedDetailsViewSwitcherNavConfiguration.linkDataSource;

        return (
            <DetailsViewBody
                deps={deps}
                tabStoreData={storeState.tabStoreData}
                tabStopsViewStoreData={storeState.tabStopsViewStoreData}
                assessmentStoreData={assessmentStoreData}
                pathSnippetStoreData={storeState.pathSnippetStoreData}
                featureFlagStoreData={storeState.featureFlagStoreData}
                cardsViewStoreData={storeState.cardsViewStoreData}
                dataTransferViewStoreData={storeState.dataTransferViewStoreData}
                selectedTest={selectedTest}
                detailsViewStoreData={storeState.detailsViewStoreData}
                visualizationStoreData={storeState.visualizationStoreData}
                visualizationScanResultData={storeState.visualizationScanResultStoreData}
                visualizationConfigurationFactory={props.deps.visualizationConfigurationFactory}
                dropdownClickHandler={props.deps.dropdownClickHandler}
                clickHandlerFactory={props.deps.clickHandlerFactory}
                assessmentInstanceTableHandler={assessmentInstanceTableHandler}
                issuesTableHandler={props.deps.issuesTableHandler}
                rightPanelConfiguration={selectedDetailsRightPanelConfiguration}
                switcherNavConfiguration={selectedDetailsViewSwitcherNavConfiguration}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
                automatedChecksCardsViewData={automatedChecksCardsViewData}
                needsReviewCardsViewData={needsReviewCardsViewData}
                assessmentCardsViewData={assessmentCardsViewData}
                scanIncompleteWarnings={
                    storeState.unifiedScanResultStoreData.scanIncompleteWarnings
                }
                scanMetadata={scanMetadata}
                isSideNavOpen={props.isSideNavOpen}
                setSideNavOpen={props.setSideNavOpen}
                narrowModeStatus={props.narrowModeStatus}
                tabStopRequirementData={tabStopRequirementData}
                overviewHeadingIntroText={overviewHeadingIntroText}
                linkDataSource={linkDataSource}
                testViewContainerProvider={props.deps.testViewContainerProvider}
                cardViewResultsHandler={props.deps.cardViewResultsHandler}
            />
        );
    };

    return (
        <>
            {renderHeader()}
            {renderDetailsView()}
            {renderOverlay()}
        </>
    );
});
