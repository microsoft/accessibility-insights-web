// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButton } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { detailsViewCommandButtons } from 'DetailsView/components/details-view-command-bar.scss';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { ExportDialogDeps } from 'DetailsView/components/export-dialog';
import { InvalidLoadAssessmentDialog } from 'DetailsView/components/invalid-load-assessment-dialog';
import {
    LoadAssessmentButtonDeps,
    LoadAssessmentButtonProps,
} from 'DetailsView/components/load-assessment-button';
import {
    LoadAssessmentDialog,
    LoadAssessmentDialogDeps,
} from 'DetailsView/components/load-assessment-dialog';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ReportExportButton } from 'DetailsView/components/report-export-button';
import {
    ReportExportDialogFactoryDeps,
    ReportExportDialogFactoryProps,
} from 'DetailsView/components/report-export-dialog-factory';
import {
    SaveAssessmentButtonFactoryDeps,
    SaveAssessmentButtonFactoryProps,
} from 'DetailsView/components/save-assessment-button-factory';
import { ShouldShowReportExportButtonProps } from 'DetailsView/components/should-show-report-export-button';
import { StartOverFactoryDeps } from 'DetailsView/components/start-over-component-factory';
import {
    dialogClosedState,
    StartOverDialog,
    StartOverDialogProps,
    StartOverDialogState,
    StartOverDialogType,
} from 'DetailsView/components/start-over-dialog';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import * as styles from './details-view-command-bar.scss';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';

export type DetailsViewCommandBarDeps = {
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
    getDateFromTimestamp: (timestamp: string) => Date;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & ExportDialogDeps &
    SaveAssessmentButtonFactoryDeps &
    LoadAssessmentButtonDeps &
    StartOverFactoryDeps &
    LoadAssessmentDialogDeps &
    ReportExportDialogFactoryDeps;

export type CommandBarProps = DetailsViewCommandBarProps;

export type DetailsViewCommandBarState = {
    isInvalidLoadAssessmentDialogOpen: boolean;
    isLoadAssessmentDialogOpen: boolean;
    isReportExportDialogOpen: boolean;
    loadedAssessmentData: VersionedAssessmentData;
    startOverDialogState: StartOverDialogState;
};

export type ReportExportDialogFactory = (props: ReportExportDialogFactoryProps) => JSX.Element;

export type SaveAssessmentButtonFactory = (props: SaveAssessmentButtonFactoryProps) => JSX.Element;
export type LoadAssessmentButtonFactory = (props: LoadAssessmentButtonProps) => JSX.Element;

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    visualizationStoreData: VisualizationStoreData;
    automatedChecksCardsViewData: CardsViewModel;
    needsReviewCardsViewData: CardsViewModel;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanMetadata: ScanMetadata;
    narrowModeStatus: NarrowModeStatus;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    selectedTest: VisualizationType;
    tabStopRequirementData: TabStopRequirementState;
}
export class DetailsViewCommandBar extends React.Component<
    DetailsViewCommandBarProps,
    DetailsViewCommandBarState
> {
    public exportDialogCloseFocus?: IButton;
    public startOverDialogCloseFocus?: IButton;

    public constructor(props) {
        super(props);
        this.state = {
            isInvalidLoadAssessmentDialogOpen: false,
            isLoadAssessmentDialogOpen: false,
            isReportExportDialogOpen: false,
            loadedAssessmentData: null,
            startOverDialogState: 'none',
        };
    }

    public render(): JSX.Element {
        if (this.props.tabStoreData.isClosed) {
            return null;
        }

        return (
            <div className={styles.detailsViewCommandBar} role="region" aria-label="command bar">
                {this.renderTargetPageInfo()}
                {this.renderFarItems()}
                {this.renderExportDialog()}
                {this.renderInvalidLoadAssessmentDialog()}
                {this.renderLoadAssessmentDialog()}
                {this.renderStartOverDialog()}
            </div>
        );
    }

    private renderTargetPageInfo(): JSX.Element {
        const targetPageTitle: string = this.props.scanMetadata.targetAppInfo.name;
        const tooltipContent = `Switch to target page: ${targetPageTitle}`;
        return (
            <div className={styles.detailsViewTargetPage} aria-labelledby="switch-to-target">
                <span id="switch-to-target">Target page:&nbsp;</span>
                <NewTabLinkWithTooltip
                    tooltipContent={tooltipContent}
                    role="link"
                    className={styles.targetPageLink}
                    onClick={this.props.deps.detailsViewActionMessageCreator.switchToTargetTab}
                    aria-label={tooltipContent}
                >
                    <span className={styles.targetPageTitle}>{targetPageTitle}</span>
                </NewTabLinkWithTooltip>
            </div>
        );
    }

    private renderFarItems(): JSX.Element {
        if (this.props.narrowModeStatus.isCommandBarCollapsed) {
            return this.renderCommandButtonsMenu();
        } else {
            return this.renderCommandButtons();
        }
    }

    private renderCommandButtons(): JSX.Element {
        const reportExportElement: JSX.Element = this.renderExportButton();
        const startOverElement: JSX.Element = this.renderStartOverButton();
        const saveAssessmentButtonElement: JSX.Element = this.renderSaveAssessmentButton();
        const loadAssessmentButtonElement: JSX.Element = this.renderLoadAssessmentButton();

        if (
            reportExportElement ||
            saveAssessmentButtonElement ||
            loadAssessmentButtonElement ||
            startOverElement
        ) {
            return (
                <div className={detailsViewCommandButtons}>
                    {reportExportElement}
                    {saveAssessmentButtonElement}
                    {loadAssessmentButtonElement}
                    {startOverElement}
                </div>
            );
        }

        return null;
    }

    private renderCommandButtonsMenu(): JSX.Element {
        return (
            <CommandBarButtonsMenu
                renderExportReportButton={this.renderExportButton}
                renderSaveAssessmentButton={this.renderSaveAssessmentButton}
                renderLoadAssessmentButton={this.renderLoadAssessmentButton}
                getStartOverMenuItem={this.getStartOverMenuItem}
                buttonRef={ref => {
                    this.exportDialogCloseFocus = ref;
                    this.startOverDialogCloseFocus = ref;
                }}
            />
        );
    }

    private showReportExportDialog = () => this.setState({ isReportExportDialogOpen: true });

    private dismissReportExportDialog = () => this.setState({ isReportExportDialogOpen: false });

    private focusReportExportButton = () => this.exportDialogCloseFocus?.focus();

    private renderExportButton = () => {
        const shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps = {
            visualizationConfigurationFactory: this.props.visualizationConfigurationFactory,
            selectedTest: this.props.selectedTest,
            tabStoreData: this.props.tabStoreData,
        };

        const showButton = this.props.switcherNavConfiguration.shouldShowReportExportButton(
            shouldShowReportExportButtonProps,
        );

        if (!showButton) {
            return null;
        }
        return (
            <ReportExportButton
                showReportExportDialog={this.showReportExportDialog}
                buttonRef={ref => (this.exportDialogCloseFocus = ref)}
            />
        );
    };

    private renderExportDialog(): JSX.Element {
        return this.props.switcherNavConfiguration.ReportExportDialogFactory({
            ...this.props,
            isOpen: this.state.isReportExportDialogOpen,
            dismissExportDialog: this.dismissReportExportDialog,
            afterDialogDismissed: this.focusReportExportButton,
        });
    }

    private renderSaveAssessmentButton = (): JSX.Element => {
        return this.props.switcherNavConfiguration.SaveAssessmentButton({
            ...this.props,
        });
    };

    private renderLoadAssessmentButton = (): JSX.Element => {
        return this.props.switcherNavConfiguration.LoadAssessmentButton({
            ...this.props,
            handleLoadAssessmentButtonClick: this.handleLoadAssessmentButtonClick,
        });
    };

    private renderLoadAssessmentDialog = (): JSX.Element => {
        return (
            <LoadAssessmentDialog
                {...this.props}
                isOpen={this.state.isLoadAssessmentDialogOpen}
                prevTab={this.props.assessmentStoreData.persistedTabInfo}
                loadedAssessmentData={this.state.loadedAssessmentData}
                tabId={this.props.tabStoreData.id}
                onClose={this.toggleLoadAssessmentDialog}
            />
        );
    };

    private renderInvalidLoadAssessmentDialog = (): JSX.Element => {
        return (
            <InvalidLoadAssessmentDialog
                {...this.props}
                isOpen={this.state.isInvalidLoadAssessmentDialogOpen}
                onClose={this.toggleInvalidLoadAssessmentDialog}
            />
        );
    };

    private toggleInvalidLoadAssessmentDialog = () => {
        this.setState(prevState => ({
            isInvalidLoadAssessmentDialogOpen: !prevState.isInvalidLoadAssessmentDialogOpen,
        }));
    };

    private toggleLoadAssessmentDialog = () => {
        this.setState(prevState => ({
            isLoadAssessmentDialogOpen: !prevState.isLoadAssessmentDialogOpen,
        }));
    };

    private setAssessmentState = (parsedAssessmentData: VersionedAssessmentData) => {
        this.setState(_ => ({
            loadedAssessmentData: parsedAssessmentData,
        }));
    };

    private handleLoadAssessmentButtonClick = () => {
        this.props.deps.loadAssessmentHelper.getAssessmentForLoad(
            this.setAssessmentState,
            this.toggleInvalidLoadAssessmentDialog,
            this.toggleLoadAssessmentDialog,
            this.props.assessmentStoreData.persistedTabInfo,
            this.props.tabStoreData.id,
        );
    };

    private showStartOverDialog = (dialogState: StartOverDialogType) => {
        this.setState({ startOverDialogState: dialogState });
    };

    private dismissStartOverDialog = () => {
        this.setState({ startOverDialogState: dialogClosedState });
    };

    private startOverDialogClosed(state: DetailsViewCommandBarState): boolean {
        return state.startOverDialogState === 'none';
    }

    public componentDidUpdate(prevProps, prevState): void {
        // Setting focus after closing the Report Export dialog is handled in the
        // afterDialogDismissed prop, which is called after the closing animation.
        // Since the start over dialog does not play the closing animation (due
        // to flickering issues), we set focus here instead.
        if (this.startOverDialogClosed(this.state) && !this.startOverDialogClosed(prevState)) {
            this.startOverDialogCloseFocus?.focus();
        }
    }

    private renderStartOverButton = () => {
        const startOverProps = this.getStartOverProps();
        const startOverComponentFactory =
            this.props.switcherNavConfiguration.StartOverComponentFactory;
        return startOverComponentFactory.getStartOverComponent(startOverProps);
    };

    private getStartOverMenuItem = () => {
        const startOverProps = this.getStartOverProps();
        const startOverComponentFactory =
            this.props.switcherNavConfiguration.StartOverComponentFactory;
        return startOverComponentFactory.getStartOverMenuItem(startOverProps);
    };

    private getStartOverProps = () => {
        return {
            ...this.props,
            openDialog: this.showStartOverDialog,
            buttonRef: ref => (this.startOverDialogCloseFocus = ref),
        };
    };

    private renderStartOverDialog(): JSX.Element {
        const dialogProps: StartOverDialogProps = {
            ...this.props,
            dialogState: this.state.startOverDialogState,
            dismissDialog: this.dismissStartOverDialog,
        };

        return <StartOverDialog {...dialogProps} />;
    }
}
