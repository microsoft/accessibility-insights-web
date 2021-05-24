// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Header, HeaderProps } from 'common/components/header';
import { GetCardSelectionViewData } from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { DetailsViewContentWithLocalState } from 'DetailsView/components/details-view-content-with-local-state';
import {
    NarrowModeDetector,
    NarrowModeDetectorDeps,
} from 'DetailsView/components/narrow-mode-detector';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { ThemeDeps } from '../common/components/theme';
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from '../common/components/with-store-subscription';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { InspectActionMessageCreator } from '../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../common/message-creators/scoping-action-message-creator';
import { GetCardViewData } from '../common/rule-based-view-model-provider';
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
import { DetailsViewCommandBarDeps } from './components/details-view-command-bar';
import { DetailsViewOverlayDeps } from './components/details-view-overlay/details-view-overlay';
import {
    DetailsRightPanelConfiguration,
    DetailsViewContentDeps,
    GetDetailsRightPanelConfiguration,
} from './components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { InteractiveHeaderDeps } from './components/interactive-header';
import { IssuesTableHandler } from './components/issues-table-handler';
import { NoContentAvailable } from './components/no-content-available/no-content-available';
import { TargetChangeDialogDeps } from './components/target-change-dialog';
import { DetailsViewBodyDeps } from './details-view-body';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';
import { PreviewFeatureFlagsHandler } from './handlers/preview-feature-flags-handler';

export type DetailsViewContainerDeps = {
    getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration;
    getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration;
    getCardViewData: GetCardViewData;
    getCardSelectionViewData: GetCardSelectionViewData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    issuesTableHandler: IssuesTableHandler;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    dropdownClickHandler: DropdownClickHandler;
    isResultHighlightUnavailable: IsResultHighlightUnavailable;
} & DetailsViewBodyDeps &
    DetailsViewOverlayDeps &
    DetailsViewCommandBarDeps &
    InteractiveHeaderDeps &
    WithStoreSubscriptionDeps<DetailsViewContainerState> &
    ThemeDeps &
    TargetChangeDialogDeps &
    NarrowModeDetectorDeps &
    DetailsViewContentDeps;

export interface DetailsViewContainerProps {
    deps: DetailsViewContainerDeps;
    storeState: DetailsViewContainerState;
}

export interface DetailsViewContainerState {
    visualizationStoreData: VisualizationStoreData;
    tabStoreData: TabStoreData;
    visualizationScanResultStoreData: VisualizationScanResultData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    assessmentStoreData: AssessmentStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    scopingPanelStateStoreData: ScopingStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    selectedDetailsView: VisualizationType;
    selectedDetailsRightPanelConfiguration: DetailsRightPanelConfiguration;
    cardSelectionStoreData: CardSelectionStoreData;
    permissionsStateStoreData: PermissionsStateStoreData;
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

export const DetailsView =
    withStoreSubscription<DetailsViewContainerProps, DetailsViewContainerState>(
        DetailsViewContainer,
    );
