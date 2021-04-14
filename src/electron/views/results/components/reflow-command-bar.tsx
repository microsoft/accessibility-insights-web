// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { FastPassLeftNavHamburgerButton } from 'common/components/expand-collapse-left-nav-hamburger-button';
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
} from 'DetailsView/components/report-export-component';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { ContentPageInfo } from 'electron/types/content-page-info';
import { css, IButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import * as styles from './reflow-command-bar.scss';

export type ReflowCommandBarDeps = {
    scanActionCreator: ScanActionCreator;
    dropdownClickHandler: DropdownClickHandler;
    reportGenerator: ReportGenerator;
    tabStopsActionCreator: TabStopsActionCreator;
} & ReportExportComponentDeps;

export interface ReflowCommandBarProps {
    deps: ReflowCommandBarDeps;
    scanPort: number;
    scanStoreData: ScanStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    cardsViewData: CardsViewModel;
    scanMetadata: ScanMetadata;
    narrowModeStatus: NarrowModeStatus;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentContentPageInfo: ContentPageInfo;
}

export const commandButtonRefreshId = 'command-button-refresh';
export const commandButtonSettingsId = 'command-button-settings';

export const ReflowCommandBar = NamedFC<ReflowCommandBarProps>('ReflowCommandBar', props => {
    const {
        deps,
        featureFlagStoreData,
        cardsViewData,
        scanMetadata,
        narrowModeStatus,
        isSideNavOpen,
        setSideNavOpen,
        currentContentPageInfo,
    } = props;
    let exportReport: JSX.Element = null;
    let dropdownMenuButtonRef: IButton = null;

    if (currentContentPageInfo.allowsExportReport && scanMetadata != null) {
        exportReport = (
            <ReportExportComponent
                deps={deps}
                reportExportFormat={'AutomatedChecks'}
                pageTitle={scanMetadata.targetAppInfo.name}
                scanDate={scanMetadata.timespan.scanComplete}
                htmlGenerator={description =>
                    deps.reportGenerator.generateFastPassAutomatedChecksReport(
                        cardsViewData,
                        description,
                        scanMetadata,
                    )
                }
                updatePersistedDescription={() => null}
                getExportDescription={() => ''}
                featureFlagStoreData={featureFlagStoreData}
                onDialogDismiss={() => {
                    dropdownMenuButtonRef.dismissMenu();
                    dropdownMenuButtonRef.focus();
                }}
            />
        );
    }

    const startOverButtonProps = {
        'data-automation-id': commandButtonRefreshId,
        text: 'Start over',
        iconProps: { iconName: 'Refresh' },
        ...currentContentPageInfo.startOverButtonSettings(props),
    };

    const hamburgerMenuButton = !narrowModeStatus.isHeaderAndNavCollapsed ? null : (
        <FastPassLeftNavHamburgerButton
            isSideNavOpen={isSideNavOpen}
            setSideNavOpen={setSideNavOpen}
            className={styles.navMenu}
        />
    );

    const getFarButtons = () => {
        if (narrowModeStatus.isCommandBarCollapsed) {
            return (
                <CommandBarButtonsMenu
                    renderExportReportButton={() => exportReport}
                    getStartOverMenuItem={() => startOverButtonProps}
                    buttonRef={ref => {
                        dropdownMenuButtonRef = ref;
                    }}
                />
            );
        }

        return (
            <>
                <FlaggedComponent
                    enableJSXElement={exportReport}
                    featureFlagStoreData={featureFlagStoreData}
                    featureFlag={UnifiedFeatureFlags.exportReport}
                />
                <InsightsCommandButton {...startOverButtonProps} />
            </>
        );
    };

    return (
        <section className={styles.commandBar} aria-label="command bar">
            {hamburgerMenuButton}
            <div className={css(styles.farItems, styles.reflow)}>
                {getFarButtons()}
                <InsightsCommandButton
                    data-automation-id={commandButtonSettingsId}
                    ariaLabel="settings"
                    iconProps={{ iconName: 'Gear', className: styles.settingsGearButtonIcon }}
                    onClick={event =>
                        deps.dropdownClickHandler.openSettingsPanelHandler(event as any)
                    }
                    className={styles.settingsGearButton}
                />
            </div>
        </section>
    );
});
