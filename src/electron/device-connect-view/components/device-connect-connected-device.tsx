// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

export interface DeviceConnectConnectedDeviceProps {
    isConnecting: boolean;
    connectedDevice?: string;
}

export const DeviceConnectConnectedDevice = NamedSFC<DeviceConnectConnectedDeviceProps>(
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

            if (props.connectedDevice) {
                return <span>{props.connectedDevice}</span>;
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
