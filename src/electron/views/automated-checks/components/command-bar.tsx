// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { commandBar, rescanButton } from './command-bar.scss';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';

export type CommandBarDeps = {
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface CommandBarProps {
    deps: CommandBarDeps;
    deviceStoreData: DeviceStoreData;
}

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', (props: CommandBarProps) => {
    const { deps, deviceStoreData } = props;

    const onClick = () => deps.deviceConnectActionCreator.validatePort(deviceStoreData.port);

    return (
        <div className={commandBar}>
            <ActionButton
                iconProps={{
                    className: rescanButton,
                    iconName: 'Refresh',
                }}
                onClick={onClick}
                text="Rescan"
            />
        </div>
    );
});
