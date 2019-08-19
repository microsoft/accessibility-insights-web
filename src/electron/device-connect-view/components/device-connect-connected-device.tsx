// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';

export interface DeviceConnectConnectedDeviceProps {
    isConnecting: boolean;
    connectedDevice?: string;
}

export class DeviceConnectConnectedDevice extends React.Component<DeviceConnectConnectedDeviceProps> {
    constructor(props: DeviceConnectConnectedDeviceProps) {
        super(props);
    }

    public render(): JSX.Element {
        const contents = this.renderContents();
        return (
            <div className="device-connect-connected-device">
                <h3>Connected device</h3>
                {contents}
            </div>
        );
    }

    private renderContents(): JSX.Element {
        if (this.props.isConnecting) {
            return (
                <Spinner
                    className="device-connect-spinner"
                    labelPosition="right"
                    size={SpinnerSize.xSmall}
                    label="Connecting to mobile device"
                />
            );
        }

        if (this.props.connectedDevice) {
            return <span>{this.props.connectedDevice}</span>;
        }
    }
}
