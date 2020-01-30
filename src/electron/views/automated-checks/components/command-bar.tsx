// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { CommandBar as UICommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
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

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', (props: CommandBarProps) => {
    const { deps, deviceStoreData } = props;

    const startOverCommandBarItem: ICommandBarItemProps = {
        key: 'startOver',
        name: 'Start over',
        iconProps: {
            className: styles.buttonIcon,
            iconName: 'Refresh',
        },
        className: styles.menuItemButton,
        onClick: () => deps.scanActionCreator.scan(deviceStoreData.port),
        disabled: props.scanStoreData.status === ScanStatus.Scanning,
    };

    const items: ICommandBarItemProps[] = [startOverCommandBarItem];

    const settingsCommandBarItem: ICommandBarItemProps = {
        key: 'settings',
        ariaLabel: 'settings',
        iconProps: {
            className: styles.buttonIcon,
            iconName: 'Gear',
        },
        className: styles.menuItemButton,
        onClick: event => deps.dropdownClickHandler.openSettingsPanelHandler(event as any),
    };

    const farItems: ICommandBarItemProps[] = [settingsCommandBarItem];

    return <UICommandBar items={items} className={styles.commandBar} farItems={farItems} />;
});
