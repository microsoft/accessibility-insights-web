// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { DeviceConnectActionCreator } from 'electron/flux/action-creator/device-connect-action-creator';
import { automatedChecksCommandBar } from './automated-checks-command-bar.scss';

export type AutomatedChecksCommandBarDeps = {
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface AutomatedChecksCommandBarProps {
    deps: AutomatedChecksCommandBarDeps;
}

export const AutomatedChecksCommandBar = NamedFC<AutomatedChecksCommandBarProps>(
    'AutomatedChecksCommandBar',
    (props: AutomatedChecksCommandBarProps) => {
        const onClick = () => props.deps.deviceConnectActionCreator.resetConnection();
        return (
            <div className={automatedChecksCommandBar}>
                <ActionButton
                    iconProps={{
                        iconName: 'Refresh',
                    }}
                    onClick={onClick}
                    text="Rescan"
                />
            </div>
        );
    },
);
