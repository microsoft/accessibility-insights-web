// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { ScanStatus } from 'electron/flux/types/scan-status';
import { commandBar, rescanButton } from './command-bar.scss';

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

    const onClick = () => deps.scanActionCreator.scan(deviceStoreData.port);

    return (
        <div className={commandBar}>
            <ActionButton
                iconProps={{
                    className: rescanButton,
                    iconName: 'Refresh',
                }}
                onClick={onClick}
                text="Rescan"
                disabled={props.scanStoreData.status === ScanStatus.Scanning}
            />
        </div>
    );
});
