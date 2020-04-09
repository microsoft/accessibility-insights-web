// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FileURLProvider } from 'common/file-url-provider';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { ActionButton, CommandButton } from 'office-ui-fabric-react';
import * as React from 'react';

import * as styles from './command-bar.scss';

export type CommandBarDeps = {
    scanActionCreator: ScanActionCreator;
    dropdownClickHandler: DropdownClickHandler;
    fileURLProvider: FileURLProvider;
};

export interface CommandBarProps {
    deps: CommandBarDeps;
    deviceStoreData: DeviceStoreData;
    scanStoreData: ScanStoreData;
    reportHTML: string;
    featureFlagStoreData: FeatureFlagStoreData;
}

export const commandButtonRefreshId = 'command-button-refresh';
export const commandButtonSettingsId = 'command-button-settings';

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const { deps, deviceStoreData, featureFlagStoreData, reportHTML } = props;

    const fileURL = props.deps.fileURLProvider.provideURL([reportHTML], 'text/html');
    const exportReport = (
        <ActionButton iconProps={{ iconName: 'Export' }} download={'atestfile.html'} href={fileURL}>
            Export result
        </ActionButton>
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
