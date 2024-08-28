// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import styles from 'DetailsView/components/details-view-command-bar.scss';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
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
import { QuickAssessToAssessmentDialog } from 'DetailsView/components/quick-assess-to-assessment-dialog';
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
    StartOverDialogDeps,
    StartOverDialogProps,
    StartOverDialogState,
    StartOverDialogType,
} from 'DetailsView/components/start-over-dialog';
import {
    TransferToAssessmentButtonDeps,
    TransferToAssessmentButtonProps,
} from 'DetailsView/components/transfer-to-assessment-button';
import { DataTransferViewStoreData } from 'DetailsView/data-transfer-view-store';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { RefObject } from 'react';

export type ButtonRefFunction = (ref: RefObject<HTMLButtonElement>) => void;

export type DetailsViewCommandBarDeps = {
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
    getDateFromTimestamp: (timestamp: string) => Date;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & SaveAssessmentButtonFactoryDeps &
    LoadAssessmentButtonDeps &
    TransferToAssessmentButtonDeps &
    StartOverFactoryDeps &
    LoadAssessmentDialogDeps &
    ReportExportDialogFactoryDeps &
    StartOverDialogDeps;

export type CommandBarProps = DetailsViewCommandBarProps;

export type DetailsViewCommandBarState = {
    isInvalidLoadAssessmentDialogOpen: boolean;
    isLoadAssessmentDialogOpen: boolean;
    isReportExportDialogOpen: boolean;
    loadedAssessmentData: VersionedAssessmentData;
    startOverDialogState: StartOverDialogState;
};

export type ReportExportDialogFactory = (
    props: ReportExportDialogFactoryProps,
) => JSX.Element | null;

export type SaveAssessmentButtonFactory = (
    props: SaveAssessmentButtonFactoryProps,
) => JSX.Element | null;
export type LoadAssessmentButtonFactory = (props: LoadAssessmentButtonProps) => JSX.Element | null;
export type TransferToAssessmentButtonFactory = (
    props: TransferToAssessmentButtonProps,
) => JSX.Element | null;

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
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
    userConfigurationStoreData: UserConfigurationStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    dataTransferViewStoreData: DataTransferViewStoreData;
}
export const DetailsViewCommandBar = props => {
    //export const DetailsViewCommandBar = React.forwardRef<HTMLButtonElement, DetailsViewCommandBarProps>((props, ref) => {
    let exportDialogCloseFocus: React.RefObject<HTMLButtonElement> =
        React.useRef<HTMLButtonElement>(null);
    let startOverDialogCloseFocus: React.RefObject<HTMLButtonElement> =
        React.useRef<HTMLButtonElement>(null);
    let transferToAssessmentDialogCloseFocus: React.RefObject<HTMLButtonElement> =
        React.useRef<HTMLButtonElement>(null);

    const [localState, setLocalState]: any = React.useState({
        isInvalidLoadAssessmentDialogOpen: false,
        isLoadAssessmentDialogOpen: false,
        isReportExportDialogOpen: false,
        loadedAssessmentData: {} as VersionedAssessmentData,
        startOverDialogState: 'none',
    });

    const renderTargetPageInfo = (): JSX.Element => {
        const targetPageTitle: string | undefined = props?.scanMetadata.targetAppInfo.name;
        const tooltipContent = `Switch to target page: ${targetPageTitle}`;
        return (
            <div className={styles.detailsViewTargetPage} aria-labelledby="switch-to-target">
                <span id="switch-to-target">Target page:&nbsp;</span>
                <NewTabLinkWithTooltip
                    tooltipContent={tooltipContent}
                    role="link"
                    className={styles.targetPageLink}
                    onClick={props?.deps.detailsViewActionMessageCreator.switchToTargetTab}
                    aria-label={tooltipContent}
                >
                    <span className={styles.targetPageTitle}>{targetPageTitle}</span>
                </NewTabLinkWithTooltip>
            </div>
        );
    };

    const renderFarItems = (): JSX.Element | null => {
        if (props?.narrowModeStatus.isCommandBarCollapsed) {
            return renderCommandButtonsMenu();
        } else {
            return renderCommandButtons();
        }
    };

    const renderCommandButtons = (): JSX.Element | null => {
        const reportExportElement: JSX.Element | null = renderExportButton();
        const startOverElement: JSX.Element = renderStartOverButton();
        const saveAssessmentButtonElement: JSX.Element | null = renderSaveAssessmentButton();
        const loadAssessmentButtonElement: JSX.Element | null = renderLoadAssessmentButton();
        const transferToAssessmentButtonElement: JSX.Element | null =
            renderTransferToAssessmentButton();

        if (
            reportExportElement ||
            saveAssessmentButtonElement ||
            loadAssessmentButtonElement ||
            transferToAssessmentButtonElement ||
            startOverElement
        ) {
            return (
                <div className={styles.detailsViewCommandButtons}>
                    {reportExportElement}
                    {saveAssessmentButtonElement}
                    {loadAssessmentButtonElement}
                    {transferToAssessmentButtonElement}
                    {startOverElement}
                </div>
            );
        }

        return null;
    };

    const renderCommandButtonsMenu = (): JSX.Element => {
        return (
            <CommandBarButtonsMenu
                renderExportReportButton={renderExportButton}
                saveAssessmentButton={renderSaveAssessmentButton()}
                loadAssessmentButton={renderLoadAssessmentButton()}
                transferToAssessmentButton={renderTransferToAssessmentButton()}
                getStartOverMenuItem={getStartOverMenuItem}
                //buttonRef={(ref: React.RefObject<HTMLButtonElement>) => startOverDialogCloseFocus = ref ?? undefined}
                // buttonRef={ref => {
                //     exportDialogCloseFocus = ref ?? undefined;
                //     startOverDialogCloseFocus = ref ?? undefined;
                //     transferToAssessmentDialogCloseFocus = ref ?? undefined;
                // }}
                // ref={ref => {
                //     startOverDialogCloseFocus.current = ref ?? undefined;
                //     exportDialogCloseFocus.current = ref ?? undefined;
                //     transferToAssessmentDialogCloseFocus.current = ref ?? undefined;
                // }
                //ref={startOverDialogCloseFocus}
                // buttonRef={ref => {
                //     startOverDialogCloseFocus = ref ?? undefined;
                //     exportDialogCloseFocus = ref ?? undefined;
                //     transferToAssessmentDialogCloseFocus = ref ?? undefined;
                // }}
                buttonRef={ref => {
                    startOverDialogCloseFocus = ref ?? undefined;
                    exportDialogCloseFocus = ref ?? undefined;
                    transferToAssessmentDialogCloseFocus = ref ?? undefined;
                }}
                // ref={ref => {
                //     startOverDialogCloseFocus = ref ?? undefined;
                //     exportDialogCloseFocus = ref ?? undefined;
                //     transferToAssessmentDialogCloseFocus = ref ?? undefined;
                // }}
            />
        );
    };

    const showReportExportDialog = () => setLocalState({ isReportExportDialogOpen: true });

    const dismissReportExportDialog = () => setLocalState({ isReportExportDialogOpen: false });

    const focusReportExportButton = () => exportDialogCloseFocus?.current?.focus();

    const focusTransferToAssessmentButton = () =>
        transferToAssessmentDialogCloseFocus?.current?.focus();

    const renderExportButton = () => {
        const shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps = {
            visualizationConfigurationFactory: props?.visualizationConfigurationFactory,
            selectedTest: props?.selectedTest,
            tabStoreData: props?.tabStoreData,
        };

        const showButton = props?.switcherNavConfiguration.shouldShowReportExportButton(
            shouldShowReportExportButtonProps,
        );

        if (!showButton) {
            return null;
        }
        return (
            <ReportExportButton
                showReportExportDialog={showReportExportDialog}
                //buttonRef={ref => (exportDialogCloseFocus = ref ?? undefined)}
                buttonRef={exportDialogCloseFocus}
            />
        );
    };

    const renderExportDialog = (): JSX.Element | null => {
        return props?.switcherNavConfiguration.ReportExportDialogFactory({
            ...props,
            isOpen: localState.isReportExportDialogOpen,
            dismissExportDialog: dismissReportExportDialog,
            afterDialogDismissed: focusReportExportButton,
        });
    };

    const renderSaveAssessmentButton = (): JSX.Element | null => {
        return props?.switcherNavConfiguration.SaveAssessmentButton({
            ...props,
            ...{
                buttonRef: transferToAssessmentDialogCloseFocus,
            },
        });
    };

    const renderTransferToAssessmentButton = (): JSX.Element | null => {
        return props?.switcherNavConfiguration.TransferToAssessmentButton({
            ...props,
            ...{
                buttonRef: transferToAssessmentDialogCloseFocus,
            },
        });
    };

    const renderTransferToAssessmentDialog = (): JSX.Element => {
        return (
            <QuickAssessToAssessmentDialog
                isShown={props?.dataTransferViewStoreData.showQuickAssessToAssessmentConfirmDialog}
                afterDialogDismissed={focusTransferToAssessmentButton}
                {...props}
            />
        );
    };

    const renderLoadAssessmentButton = (): JSX.Element | null => {
        return props?.switcherNavConfiguration.LoadAssessmentButton({
            ...props,
            handleLoadAssessmentButtonClick: handleLoadAssessmentButtonClick,
            ...{ buttonRef: transferToAssessmentDialogCloseFocus },
        });
    };

    const renderLoadAssessmentDialog = (): JSX.Element => {
        return (
            <LoadAssessmentDialog
                {...props}
                isOpen={localState.isLoadAssessmentDialogOpen}
                prevTab={props?.assessmentStoreData.persistedTabInfo}
                loadedAssessmentData={localState.loadedAssessmentData}
                tabId={props?.tabStoreData.id!}
                onClose={toggleLoadAssessmentDialog}
            />
        );
    };

    const renderInvalidLoadAssessmentDialog = (): JSX.Element => {
        return (
            <InvalidLoadAssessmentDialog
                {...props}
                isOpen={localState.isInvalidLoadAssessmentDialogOpen}
                onClose={toggleInvalidLoadAssessmentDialog}
            />
        );
    };

    const toggleInvalidLoadAssessmentDialog = () => {
        setLocalState(prevState => ({
            isInvalidLoadAssessmentDialogOpen: !prevState.isInvalidLoadAssessmentDialogOpen,
        }));
    };

    const toggleLoadAssessmentDialog = () => {
        setLocalState(prevState => ({
            isLoadAssessmentDialogOpen: !prevState.isLoadAssessmentDialogOpen,
        }));
    };

    const setAssessmentState = (parsedAssessmentData: VersionedAssessmentData) => {
        setLocalState(_ => ({
            loadedAssessmentData: parsedAssessmentData,
        }));
    };

    const handleLoadAssessmentButtonClick = () => {
        props?.deps.loadAssessmentHelper.getAssessmentForLoad(
            setAssessmentState,
            toggleInvalidLoadAssessmentDialog,
            toggleLoadAssessmentDialog,
            props?.assessmentStoreData.persistedTabInfo,
            props?.tabStoreData.id!,
        );
    };

    const showStartOverDialog = (dialogState: StartOverDialogType) => {
        setLocalState({ startOverDialogState: dialogState });
    };

    const dismissStartOverDialog = () => {
        setLocalState({ startOverDialogState: dialogClosedState });
        startOverDialogCloseFocus?.current?.focus();
    };

    const startOverDialogClosed = (state: DetailsViewCommandBarState): boolean => {
        return state.startOverDialogState === 'none';
    };

    // const componentDidUpdate(prevProps, prevState): void {
    //     // Setting focus after closing the Report Export dialog is handled in the
    //     // afterDialogDismissed prop, which is called after the closing animation.
    //     // Since the start over dialog does not play the closing animation (due
    //     // to flickering issues), we set focus here instead.
    //     if (startOverDialogClosed(localState) && !startOverDialogClosed(prevState)) {
    //         startOverDialogCloseFocus?.focus();
    //     }
    // }

    React.useEffect(() => {
        if (startOverDialogClosed(localState) && localState.startOverDialogState !== 'none') {
            startOverDialogCloseFocus?.current?.removeAttribute('textprediction');
            startOverDialogCloseFocus?.current?.setAttribute('writingsuggestions', 'false');
            startOverDialogCloseFocus?.current?.focus();
        }
    }, [localState.startOverDialogState]);

    const renderStartOverButton = () => {
        const startOverProps = getStartOverProps();
        const startOverComponentFactory = props?.switcherNavConfiguration.StartOverComponentFactory;
        return startOverComponentFactory.getStartOverComponent(startOverProps);
    };

    const getStartOverMenuItem = () => {
        const startOverProps = getStartOverProps('hasSubMenu');
        const startOverComponentFactory = props?.switcherNavConfiguration.StartOverComponentFactory;
        return startOverComponentFactory.getStartOverMenuItem(startOverProps);
    };

    const getStartOverProps = (value?: string) => {
        return {
            ...props,
            // withComponent: true,
            hasSubMenu: value ? true : false,
            openDialog: showStartOverDialog,
            //buttonRef: ref => (startOverDialogCloseFocus = ref),
            buttonRef: startOverDialogCloseFocus,
            // ...{ buttonRef: startOverDialogCloseFocus }
        };
    };

    const renderStartOverDialog = (): JSX.Element => {
        const dialogProps: StartOverDialogProps = {
            ...props,
            dialogState: localState.startOverDialogState,
            dismissDialog: dismissStartOverDialog,
            ...{ buttonRef: startOverDialogCloseFocus },
        };

        return <StartOverDialog {...dialogProps} />;
    };

    return props?.tabStoreData.isClosed ? null : (
        <div className={styles.detailsViewCommandBar} role="region" aria-label="command bar">
            {renderTargetPageInfo()}
            {renderFarItems()}
            {renderExportDialog()}
            {renderInvalidLoadAssessmentDialog()}
            {renderLoadAssessmentDialog()}
            {(localState.startOverDialogState === 'assessment' ||
                localState.startOverDialogState === 'test') &&
                renderStartOverDialog()}
            {renderTransferToAssessmentDialog()}
        </div>
    );
};
