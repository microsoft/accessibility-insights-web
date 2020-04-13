// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
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
    getDateFromTimestamp: (timestamp: string) => Date;
    reportGenerator: ReportGenerator;
} & ReportExportComponentDeps;

export interface CommandBarProps {
    deps: CommandBarDeps;
    deviceStoreData: DeviceStoreData;
    scanStoreData: ScanStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    cardsViewData: CardsViewModel;
    targetAppName: string;
    scanMetaData: ScanMetaData;
}

export const commandButtonRefreshId = 'command-button-refresh';
export const commandButtonSettingsId = 'command-button-settings';

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const {
        deps,
        deviceStoreData,
        featureFlagStoreData,
        targetAppName,
        cardsViewData,
        scanMetaData,
    } = props;
    let exportReport = null;

    if (scanMetaData != null) {
        exportReport = (
            <ReportExportComponent
                deps={deps}
                exportResultsType={'AutomatedChecks'}
                pageTitle={targetAppName}
                scanDate={deps.getDateFromTimestamp(scanMetaData.timestamp)}
                htmlGenerator={description =>
                    deps.reportGenerator.generateFastPassAutomatedChecksReport(
                        deps.getDateFromTimestamp(scanMetaData.timestamp),
                        {
                            name: targetAppName,
                            url: null,
                        },
                        cardsViewData,
                        description,
                        scanMetaData.toolData,
                    )
                }
                updatePersistedDescription={() => null}
                getExportDescription={() => ''}
                featureFlagStoreData={featureFlagStoreData}
            />
        );
    }

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
