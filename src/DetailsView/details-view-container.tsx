// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner, SpinnerSize } from '@fluentui/react';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { Header, HeaderProps } from 'common/components/header';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateDeps,
} from 'DetailsView/components/details-view-content-with-local-state';
import {
    NarrowModeDetector,
    NarrowModeDetectorDeps,
} from 'DetailsView/components/narrow-mode-detector';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { DataTransferViewStoreData } from 'DetailsView/data-transfer-view-store';
import * as React from 'react';
import { withStoreSubscription } from '../common/components/with-store-subscription';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewStoreData } from '../common/types/store-data/details-view-store-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { PermissionsStateStoreData } from '../common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from '../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from '../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { NoContentAvailable } from './components/no-content-available/no-content-available';

export type DetailsViewContainerDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & NarrowModeDetectorDeps &
    DetailsViewContentWithLocalStateDeps;

export interface DetailsViewContainerProps {
    deps: DetailsViewContainerDeps;
    storeState: DetailsViewContainerState;
}

export interface DetailsViewContainerState {
    visualizationStoreData: VisualizationStoreData;
    tabStoreData: TabStoreData;
    visualizationScanResultStoreData: VisualizationScanResultData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
    needsReviewScanResultStoreData: NeedsReviewScanResultStoreData;
    needsReviewCardSelectionStoreData: NeedsReviewCardSelectionStoreData;
    assessmentCardSelectionStoreData: AssessmentCardSelectionStoreData;
    quickAssessCardSelectionStoreData: AssessmentCardSelectionStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    assessmentStoreData: AssessmentStoreData;
    quickAssessStoreData: AssessmentStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    scopingPanelStateStoreData: ScopingStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    selectedDetailsView: VisualizationType;
    selectedDetailsRightPanelConfiguration: DetailsRightPanelConfiguration;
    permissionsStateStoreData: PermissionsStateStoreData;
    tabStopsViewStoreData: TabStopsViewStoreData;
    cardsViewStoreData: CardsViewStoreData;
    dataTransferViewStoreData: DataTransferViewStoreData;
}

export class DetailsViewContainer extends React.Component<DetailsViewContainerProps> {
    private initialRender: boolean = true;

    public render(): JSX.Element {
        if (this.shouldShowNoContentAvailable()) {
            const headerProps: Omit<HeaderProps, 'narrowModeStatus'> = { deps: this.props.deps };
            return (
                <>
                    <NarrowModeDetector
                        deps={this.props.deps}
                        isNarrowModeEnabled={this.hasStores()}
                        Component={Header}
                        childrenProps={headerProps}
                    />
                    <NoContentAvailable />
                </>
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

    private shouldShowNoContentAvailable(): boolean {
        return (
            !this.hasStores() ||
            (this.props.deps.storesHub.hasStoreData() && this.isTargetPageInvalid())
        );
    }

    private isTargetPageInvalid(): boolean {
        return (
            this.isTargetPageClosed() ||
            (this.isTargetPageOriginDifferent() && !this.isAllTabsPermissionGranted())
        );
    }

    private isTargetPageClosed(): boolean {
        return this.props.storeState.tabStoreData.isClosed;
    }

    private isTargetPageOriginDifferent(): boolean {
        return this.props.storeState.tabStoreData.isOriginChanged;
    }

    private isAllTabsPermissionGranted(): boolean {
        return this.props.storeState.permissionsStateStoreData.hasAllUrlAndFilePermissions;
    }

    private renderSpinner(): JSX.Element {
        return (
            <Spinner className="details-view-spinner" size={SpinnerSize.large} label="Loading..." />
        );
    }

    private renderContent(): JSX.Element {
        return <DetailsViewContentWithLocalState {...this.props} />;
    }

    private hasStores(): boolean {
        return this.props.deps.storesHub.hasStores();
    }
}

export const DetailsView = withStoreSubscription<
    DetailsViewContainerProps,
    DetailsViewContainerState
>(DetailsViewContainer);
