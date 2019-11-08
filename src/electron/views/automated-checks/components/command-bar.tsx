// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { CommandBar as UICommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import * as React from 'react';

import { buttonIcon, commandBar, menuItemButton } from './command-bar.scss';

export type CommandBarDeps = {
    scanActionCreator: ScanActionCreator;
};

export interface CommandBarProps {
    deps: CommandBarDeps;
    deviceStoreData: DeviceStoreData;
    scanStoreData: ScanStoreData;
}

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', (props: CommandBarProps) => {
    const { deps, deviceStoreData } = props;

    const onRescanClick = () => deps.scanActionCreator.scan(deviceStoreData.port);
    const rescanCommandBarItem: ICommandBarItemProps = {
        key: 'rescan',
        name: 'Rescan',
        iconProps: {
            className: buttonIcon,
            iconName: 'Refresh',
        },
        className: menuItemButton,
        onClick: onRescanClick,
        disabled: props.scanStoreData.status === ScanStatus.Scanning,
    };

    // UICommandBar doesn't do null checks for these. Use empty lists for "no items", not null/undefined.
    const items: ICommandBarItemProps[] = [rescanCommandBarItem];
    const farItems: ICommandBarItemProps[] = [];

    return <UICommandBar items={items} farItems={farItems} className={commandBar} />;
});
