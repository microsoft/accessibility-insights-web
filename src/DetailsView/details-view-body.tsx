// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import classNames from 'classnames';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { DetailsViewCommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { FluentSideNav, FluentSideNavDeps } from 'DetailsView/components/left-nav/fluent-side-nav';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import {
    QuickAssessToAssessmentDialog,
    QuickAssessToAssessmentDialogDeps,
} from 'DetailsView/components/quick-assess-to-assessment-dialog';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { TestViewContainerProvider } from 'DetailsView/components/test-view-container-provider';
import { DataTransferViewStoreData } from 'DetailsView/data-transfer-view-store';
import styles from 'DetailsView/details-view-body.scss';
import * as React from 'react';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { DropdownClickHandler } from '../common/dropdown-click-handler';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewStoreData } from '../common/types/store-data/details-view-store-data';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../common/types/store-data/user-configuration-store';
import {
    TabStopRequirementState,
    VisualizationScanResultData,
} from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DetailsViewCommandBarDeps } from './components/details-view-command-bar';
import {
    DetailsRightPanelConfiguration,
    RightPanelDeps,
} from './components/details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration } from './components/details-view-switcher-nav';
import { IssuesTableHandler } from './components/issues-table-handler';
import { DetailsViewLeftNavDeps } from './components/left-nav/details-view-left-nav';
import { TargetPageHiddenBar } from './components/target-page-hidden-bar';
import { AssessmentInstanceTableHandler } from './handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from './handlers/details-view-toggle-click-handler-factory';

export type DetailsViewBodyDeps = RightPanelDeps &
    DetailsViewLeftNavDeps &
    DetailsViewCommandBarDeps &
    FluentSideNavDeps &
    QuickAssessToAssessmentDialogDeps;

export interface DetailsViewBodyProps {
    deps: DetailsViewBodyDeps;
    tabStoreData: TabStoreData;
    tabStopsViewStoreData: TabStopsViewStoreData;
    assessmentStoreData: AssessmentStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    cardsViewStoreData: CardsViewStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    dropdownClickHandler: DropdownClickHandler;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    issuesTableHandler: IssuesTableHandler;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    userConfigurationStoreData: UserConfigurationStoreData;
    automatedChecksCardsViewData: CardsViewModel;
    needsReviewCardsViewData: CardsViewModel;
    assessmentCardsViewData: CardsViewModel;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
    scanMetadata: ScanMetadata;
    isSideNavOpen: boolean;
    setSideNavOpen: (isOpen: boolean, event?: React.MouseEvent<any>) => void;
    narrowModeStatus: NarrowModeStatus;
    tabStopRequirementData: TabStopRequirementState;
    dataTransferViewStoreData: DataTransferViewStoreData;
    testViewContainerProvider: TestViewContainerProvider;
    getProvider: () => AssessmentsProvider;
}

export class DetailsViewBody extends React.Component<DetailsViewBodyProps> {
    public render(): JSX.Element {
        const bodyContentContainerClassName = classNames(styles.detailsViewContentPaneContainer, {
            [styles.narrowMode]: this.props.narrowModeStatus.isHeaderAndNavCollapsed,
        });

        return (
            <div className={styles.detailsViewBody}>
                <div className={styles.detailsViewBodyNavContentLayout}>
                    {this.renderNavBar()}
                    <div className={bodyContentContainerClassName}>
                        {this.renderCommandBar()}
                        <div className={styles.detailsViewBodyContentPane}>
                            {this.getTargetPageHiddenBar()}
                            <div className={styles.view} role="main">
                                {this.renderQuickAssessToAssessmentDialog()}
                                {this.renderRightPanel()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderCommandBar(): JSX.Element {
        const { switcherNavConfiguration } = this.props;

        const detailsViewCommandBarProps: DetailsViewCommandBarProps = {
            ...this.props,
        };

        return <switcherNavConfiguration.CommandBar {...detailsViewCommandBarProps} />;
    }

    private renderNavBar(): JSX.Element {
        return (
            <FluentSideNav
                selectedPivot={this.props.visualizationStoreData?.selectedDetailsViewPivot}
                isSideNavOpen={this.props.isSideNavOpen}
                setSideNavOpen={this.props.setSideNavOpen}
                onRightPanelContentSwitch={() => this.props.setSideNavOpen(false)}
                narrowModeStatus={this.props.narrowModeStatus}
                {...this.props}
            />
        );
    }

    private getTargetPageHiddenBar(): JSX.Element {
        const { tabStoreData } = this.props;

        if (tabStoreData.isClosed) {
            return null;
        }

        return <TargetPageHiddenBar isTargetPageHidden={tabStoreData.isPageHidden} />;
    }

    private renderRightPanel(): JSX.Element {
        return <this.props.rightPanelConfiguration.RightPanel {...this.props} />;
    }

    private renderQuickAssessToAssessmentDialog(): JSX.Element {
        return (
            <QuickAssessToAssessmentDialog
                isShown={
                    this.props.dataTransferViewStoreData.showQuickAssessToAssessmentConfirmDialog
                }
                deps={this.props.deps}
            />
        );
    }
}
