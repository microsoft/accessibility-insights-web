// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
} from 'DetailsView/components/report-export-component';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import * as styles from './command-bar.scss';

export type CommandBarDeps = {
    scanActionCreator: ScanActionCreator;
    dropdownClickHandler: DropdownClickHandler;
    reportGenerator: ReportGenerator;
} & ReportExportComponentDeps;

export interface CommandBarProps {
    deps: CommandBarDeps;
    scanPort: number;
    scanStoreData: ScanStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    cardsViewData: CardsViewModel;
    scanMetadata: ScanMetadata;
}

export const commandButtonRefreshId = 'command-button-refresh';
export const commandButtonSettingsId = 'command-button-settings';

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const { deps, scanPort, featureFlagStoreData, cardsViewData, scanMetadata } = props;
    let exportReport = null;

    if (scanMetadata != null) {
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
            />
        );
    }

    const startOver: JSX.Element = (
        <InsightsCommandButton
            data-automation-id={commandButtonRefreshId}
            text="Start over"
            iconProps={{ iconName: 'Refresh' }}
            onClick={() => deps.scanActionCreator.scan(scanPort)}
            disabled={props.scanStoreData.status === ScanStatus.Scanning}
        />
    );

    return (
        <section className={styles.commandBar} aria-label="command bar">
            <div className={styles.farItems}>
                <FlaggedComponent
                    enableJSXElement={exportReport}
                    featureFlagStoreData={featureFlagStoreData}
                    featureFlag={UnifiedFeatureFlags.exportReport}
                />
                {startOver}
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
