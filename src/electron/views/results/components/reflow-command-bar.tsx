// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FastPassLeftNavHamburgerButton } from 'common/components/expand-collapse-left-nav-hamburger-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ReportExportButton } from 'DetailsView/components/report-export-button';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
} from 'DetailsView/components/report-export-component';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { ContentPageInfo } from 'electron/types/content-page-info';
import { css, IButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportExportServiceProvider } from 'report-export/report-export-service-provider';
import { ReportGenerator } from 'reports/report-generator';
import * as styles from './reflow-command-bar.scss';

export type ReflowCommandBarDeps = {
    scanActionCreator: ScanActionCreator;
    dropdownClickHandler: DropdownClickHandler;
    reportGenerator: ReportGenerator;
    tabStopsActionCreator: TabStopsActionCreator;
    reportExportServiceProvider: ReportExportServiceProvider;
} & ReportExportComponentDeps;

export interface ReflowCommandBarProps {
    deps: ReflowCommandBarDeps;
    scanStoreData: ScanStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    cardsViewData: CardsViewModel;
    scanMetadata: ScanMetadata;
    narrowModeStatus: NarrowModeStatus;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentContentPageInfo: ContentPageInfo;
}

export interface ReflowCommandBarState {
    reportExportDialogIsOpen: boolean;
}

export const commandButtonRefreshId = 'command-button-refresh';
export const commandButtonSettingsId = 'command-button-settings';

export class ReflowCommandBar extends React.Component<
    ReflowCommandBarProps,
    ReflowCommandBarState
> {
    constructor(props) {
        super(props);
        this.state = {
            reportExportDialogIsOpen: false,
        };
    }

    private dropdownMenuButtonRef: IButton = null;

    private showReportExportDialog = () => {
        this.setState({ reportExportDialogIsOpen: true });
    };

    private renderExportReportButton = (): JSX.Element => {
        if (
            this.props.currentContentPageInfo.allowsExportReport &&
            this.props.scanMetadata !== null
        ) {
            return <ReportExportButton showReportExportDialog={this.showReportExportDialog} />;
        }

        return null;
    };

    private renderExportDialog = (): JSX.Element => {
        const { deps, scanMetadata, cardsViewData, featureFlagStoreData } = this.props;
        if (this.props.scanMetadata !== null) {
            return (
                <ReportExportComponent
                    deps={deps}
                    isOpen={this.state.reportExportDialogIsOpen}
                    reportExportFormat={'AutomatedChecks'}
                    pageTitle={scanMetadata.targetAppInfo.name}
                    scanDate={scanMetadata.timespan.scanComplete}
                    htmlGenerator={description =>
                        this.props.deps.reportGenerator.generateFastPassAutomatedChecksReport(
                            cardsViewData,
                            description,
                            scanMetadata,
                        )
                    }
                    jsonGenerator={() => null}
                    updatePersistedDescription={() => null}
                    getExportDescription={() => ''}
                    featureFlagStoreData={featureFlagStoreData}
                    dismissExportDialog={() => {
                        this.setState({ reportExportDialogIsOpen: false });
                    }}
                    afterDialogDismissed={() => {
                        this.dropdownMenuButtonRef.dismissMenu();
                        this.dropdownMenuButtonRef.focus();
                    }}
                    reportExportServices={deps.reportExportServiceProvider.servicesForFastPass()}
                />
            );
        }
        return null;
    };

    private startOverButtonProps = {
        'data-automation-id': commandButtonRefreshId,
        text: 'Start over',
        iconProps: { iconName: 'Refresh' },
        ...this.props.currentContentPageInfo.startOverButtonSettings(this.props),
    };

    private hamburgerMenuButton = !this.props.narrowModeStatus.isHeaderAndNavCollapsed ? null : (
        <FastPassLeftNavHamburgerButton
            isSideNavOpen={this.props.isSideNavOpen}
            setSideNavOpen={this.props.setSideNavOpen}
            className={styles.navMenu}
        />
    );

    private getFarButtons = () => {
        if (this.props.narrowModeStatus.isCommandBarCollapsed) {
            return (
                <CommandBarButtonsMenu
                    renderExportReportButton={this.renderExportReportButton}
                    getStartOverMenuItem={() => this.startOverButtonProps}
                    buttonRef={ref => {
                        this.dropdownMenuButtonRef = ref;
                    }}
                />
            );
        }

        return (
            <>
                {this.renderExportReportButton()}
                <InsightsCommandButton {...this.startOverButtonProps} />
            </>
        );
    };

    public render(): JSX.Element {
        return (
            <section className={styles.commandBar} aria-label="command bar">
                {this.hamburgerMenuButton}
                <div className={css(styles.farItems, styles.reflow)}>
                    {this.getFarButtons()}
                    <InsightsCommandButton
                        data-automation-id={commandButtonSettingsId}
                        ariaLabel="settings"
                        iconProps={{ iconName: 'Gear', className: styles.settingsGearButtonIcon }}
                        onClick={event =>
                            this.props.deps.dropdownClickHandler.openSettingsPanelHandler(
                                event as any,
                            )
                        }
                        className={styles.settingsGearButton}
                    />
                    {this.renderExportDialog()}
                </div>
            </section>
        );
    }
}
