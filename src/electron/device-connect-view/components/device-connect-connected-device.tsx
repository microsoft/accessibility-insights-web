// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-sfc';

export interface DeviceConnectConnectedDeviceProps {
    isConnecting: boolean;
    hasFailed: boolean;
    connectedDevice?: string;
}

export const DeviceConnectConnectedDevice = NamedFC<DeviceConnectConnectedDeviceProps>(
    'DeviceConnectConnectedDevice',
    (props: DeviceConnectConnectedDeviceProps) => {
        const renderContents = (): JSX.Element => {
            if (props.isConnecting) {
                return (
                    <Spinner
                        className="device-connect-spinner"
                        labelPosition="right"
                        size={SpinnerSize.xSmall}
                        label="Connecting to mobile device"
                    />
                );
            }

            if (props.hasFailed) {
                return (
                    <>
                        <Icon iconName="statusErrorFull" className="connection-error-icon" ariaLabel="Connection failed"></Icon>
                        <span className="scanned-text">No active applications were found at the provided local host.</span>
                    </>
                );
            }
            if (props.connectedDevice) {
                return <span className="scanned-text">{props.connectedDevice}</span>;
            }
        };

        return (
            <div className="device-connect-connected-device">
                <h3>Connected device</h3>
                {renderContents()}
            </div>
        );
    },
);
