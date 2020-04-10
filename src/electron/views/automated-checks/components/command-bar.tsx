// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    ReportExportComponent,
    ReportExportComponentDeps,
} from 'DetailsView/components/report-export-component';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { CommandButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

import * as styles from './command-bar.scss';

export type CommandBarDeps = {
    scanActionCreator: ScanActionCreator;
    dropdownClickHandler: DropdownClickHandler;
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
} & ReportExportComponentDeps;

export interface CommandBarProps {
    deps: CommandBarDeps;
    deviceStoreData: DeviceStoreData;
    scanStoreData: ScanStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    cardsViewData: CardsViewModel;
    targetAppName: string;
}

export const commandButtonRefreshId = 'command-button-refresh';
export const commandButtonSettingsId = 'command-button-settings';

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const { deps, deviceStoreData, featureFlagStoreData, targetAppName, cardsViewData } = props;

    const currentDate = deps.getCurrentDate();
    const exportReport = (
        <ReportExportComponent
            deps={deps}
            exportResultsType={'AutomatedChecks'}
            pageTitle={targetAppName}
            scanDate={currentDate}
            htmlGenerator={description =>
                deps.reportGenerator.generateFastPassAutomatedChecksReport(
                    currentDate,
                    targetAppName,
                    null,
                    cardsViewData,
                    description,
                )
            }
            updatePersistedDescription={() => null}
            getExportDescription={() => ''}
        />
    );

    return (
        <section className={styles.commandBar} aria-label="command bar">
            <div className={styles.items}>
                <CommandButton
                    data-automation-id={commandButtonRefreshId}
                    text="Start over"
                    iconProps={{ iconName: 'Refresh', className: styles.buttonIcon }}
                    className={styles.menuItemButton}
                    onClick={() => deps.scanActionCreator.scan(deviceStoreData.port)}
                    disabled={props.scanStoreData.status === ScanStatus.Scanning}
                />
            </div>
            <div className={styles.farItems}>
                <FlaggedComponent
                    enableJSXElement={exportReport}
                    featureFlagStoreData={featureFlagStoreData}
                    featureFlag={UnifiedFeatureFlags.exportReport}
                />
                <CommandButton
                    data-automation-id={commandButtonSettingsId}
                    ariaLabel="settings"
                    iconProps={{ iconName: 'Gear', className: styles.buttonIcon }}
                    className={styles.menuItemButton}
                    onClick={event =>
                        deps.dropdownClickHandler.openSettingsPanelHandler(event as any)
                    }
                />
            </div>
        </section>
    );
});
