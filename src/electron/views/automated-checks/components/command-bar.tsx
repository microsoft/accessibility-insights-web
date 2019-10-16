// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { commandBar, rescanButton } from './command-bar.scss';

export type CommandBarDeps = {
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface CommandBarProps {
    deps: CommandBarDeps;
}

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', (props: CommandBarProps) => {
    const onClick = () => props.deps.deviceConnectActionCreator.resetConnection();
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
