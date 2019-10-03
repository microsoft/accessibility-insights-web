// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { NamedFC } from '../../../../common/react/named-fc';
import {
    connectionErrorIcon,
    deviceConnectConnectedDevice,
    deviceConnectSpinner,
    scannedText,
} from './device-connect-connected-device.scss';
import { DeviceConnectState } from './device-connect-state';

export interface DeviceConnectConnectedDeviceProps {
    deviceConnectState: DeviceConnectState;
    connectedDevice?: string;
}

export const DeviceConnectConnectedDevice = NamedFC<DeviceConnectConnectedDeviceProps>(
    'DeviceConnectConnectedDevice',
    (props: DeviceConnectConnectedDeviceProps) => {
        const renderContents = (): JSX.Element => {
            if (props.deviceConnectState === DeviceConnectState.Connecting) {
                return (
                    <Spinner
                        className={deviceConnectSpinner}
                        labelPosition="right"
                        size={SpinnerSize.xSmall}
                        label="Connecting to mobile device"
                    />
                );
            }

            if (props.deviceConnectState === DeviceConnectState.Error) {
                return (
                    <>
                        <Icon iconName="statusErrorFull" className={connectionErrorIcon} ariaLabel="Connection failed"></Icon>
                        <span className={scannedText}>No active applications were found at the provided local host.</span>
                    </>
                );
            }

            if (props.deviceConnectState === DeviceConnectState.Default) {
                return null;
            }

            if (props.connectedDevice) {
                return <span className={scannedText}>{props.connectedDevice}</span>;
            }
        };

        return (
            <div className={deviceConnectConnectedDevice}>
                <h3>Connected device</h3>
                {renderContents()}
            </div>
        );
    },
);
