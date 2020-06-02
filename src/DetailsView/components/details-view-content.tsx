// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { DetailsViewOverlay } from 'DetailsView/components/details-view-overlay/details-view-overlay';
import { InteractiveHeader } from 'DetailsView/components/interactive-header';
import { DetailsViewBody } from 'DetailsView/details-view-body';
import { DetailsViewContainerProps } from 'DetailsView/details-view-container';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

export type DetailsViewContentProps = DetailsViewContainerProps;

export const DetailsViewContent = NamedFC<DetailsViewContentProps>('DetailsViewContent', props => {
    const [isSideNavOpen, setSideNavOpen] = React.useState(false);

    const renderHeader = (isNarrowMode: boolean) => {
        const storeState = props.storeState;
        const visualizationStoreData = storeState ? storeState.visualizationStoreData : null;
        return (
            <InteractiveHeader
                deps={props.deps}
                selectedPivot={
                    visualizationStoreData ? visualizationStoreData.selectedDetailsViewPivot : null
                }
                featureFlagStoreData={storeState.featureFlagStoreData}
                tabClosed={props.storeState.tabStoreData.isClosed}
                setSideNavOpen={setSideNavOpen}
                isNarrowMode={isNarrowMode}
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

    const renderDetailsView = (isNarrowMode: boolean) => {
        const { deps, storeState } = props;
        const selectedDetailsRightPanelConfiguration = props.deps.getDetailsRightPanelConfiguration(
            {
                selectedDetailsViewPivot:
                    storeState.visualizationStoreData.selectedDetailsViewPivot,
                detailsViewRightContentPanel:
                    storeState.detailsViewStoreData.detailsViewRightContentPanel,
            },
        );
        const selectedDetailsViewSwitcherNavConfiguration = props.deps.getDetailsSwitcherNavConfiguration(
            {
                selectedDetailsViewPivot:
                    storeState.visualizationStoreData.selectedDetailsViewPivot,
            },
        );
        const selectedTest = selectedDetailsViewSwitcherNavConfiguration.getSelectedDetailsView(
            storeState,
        );

        const cardsViewData = props.deps.getCardViewData(
            props.storeState.unifiedScanResultStoreData.rules,
            props.storeState.unifiedScanResultStoreData.results,
            props.deps.getCardSelectionViewData(
                props.storeState.cardSelectionStoreData,
                props.storeState.unifiedScanResultStoreData,
                props.deps.isResultHighlightUnavailable,
            ),
        );

        const targetAppInfo = {
            name: props.storeState.tabStoreData.title,
            url: props.storeState.tabStoreData.url,
        };

        const scanMetadata: ScanMetadata = {
            timestamp: props.storeState.unifiedScanResultStoreData.timestamp,
            targetAppInfo: targetAppInfo,
            toolData: props.storeState.unifiedScanResultStoreData.toolInfo,
        };

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
                visualizationConfigurationFactory={props.deps.visualizationConfigurationFactory}
                assessmentsProvider={props.deps.assessmentsProvider}
                dropdownClickHandler={props.deps.dropdownClickHandler}
                clickHandlerFactory={props.deps.clickHandlerFactory}
                assessmentInstanceTableHandler={props.deps.assessmentInstanceTableHandler}
                issuesSelection={props.deps.issuesSelection}
                issuesTableHandler={props.deps.issuesTableHandler}
                rightPanelConfiguration={selectedDetailsRightPanelConfiguration}
                switcherNavConfiguration={selectedDetailsViewSwitcherNavConfiguration}
                userConfigurationStoreData={storeState.userConfigurationStoreData}
                cardsViewData={cardsViewData}
                cardSelectionStoreData={storeState.cardSelectionStoreData}
                scanIncompleteWarnings={
                    storeState.unifiedScanResultStoreData.scanIncompleteWarnings
                }
                scanMetadata={scanMetadata}
                isSideNavOpen={isSideNavOpen}
                setSideNavOpen={setSideNavOpen}
                isNarrowMode={isNarrowMode}
            />
        );
    };

    return (
        <ReactResizeDetector handleWidth querySelector="body">
            {dimentions => {
                const isNarrowMode =
                    props.storeState.featureFlagStoreData[FeatureFlags.reflowUI] === true &&
                    dimentions.width < 600;
                return (
                    <>
                        {renderHeader(isNarrowMode)}
                        {renderDetailsView(isNarrowMode)}
                        {renderOverlay()}
                    </>
                );
            }}
        </ReactResizeDetector>
    );
});
