// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { CommandButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './command-bar.scss';

export type CommandBarDeps = {
    scanActionCreator: ScanActionCreator;
    dropdownClickHandler: DropdownClickHandler;
};

export interface CommandBarProps {
    deps: CommandBarDeps;
    deviceStoreData: DeviceStoreData;
    scanStoreData: ScanStoreData;
}

export const commandButtonRefreshId = 'command-button-refresh';

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const { deps, deviceStoreData } = props;

    return (
        <section className={styles.commandBar} role="region" aria-label="command bar">
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
                <CommandButton
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
