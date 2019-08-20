// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter } from './device-connect-footer';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry } from './device-connect-port-entry';

export type OnConnectedCallback = (isConnected: boolean, deviceName: string) => void;
export type OnConnectingCallback = () => void;

export interface DeviceConnectBodyProps {
    currentWindow: BrowserWindow;
}

export interface DeviceConnectBodyState {
    canStartTesting: boolean;
    needsValidation: boolean;
    isConnecting: boolean;
    connectedDevice?: string;
}

export class DeviceConnectBody extends React.Component<DeviceConnectBodyProps, DeviceConnectBodyState> {
    constructor(props: DeviceConnectBodyProps) {
        super(props);
        this.state = {
            canStartTesting: false,
            needsValidation: true,
            isConnecting: false,
        };
    }

    public render(): JSX.Element {
        return (
            <div className="device-connect-body">
                <DeviceConnectHeader />
                <DeviceConnectPortEntry
                    needsValidation={this.state.needsValidation}
                    onConnectedCallback={this.OnConnectedCallback}
                    onConnectingCallback={this.OnConnectingCallback}
                />
                <DeviceConnectConnectedDevice isConnecting={this.state.isConnecting} connectedDevice={this.state.connectedDevice} />
                <DeviceConnectFooter
                    cancelClick={this.props.currentWindow.close}
                    canStartTesting={this.state.canStartTesting}
                ></DeviceConnectFooter>
            </div>
        );
    }

    private OnConnectingCallback: OnConnectingCallback = () => {
        this.setState({ isConnecting: true, canStartTesting: false, needsValidation: true, connectedDevice: '' });
    };

    private OnConnectedCallback: OnConnectedCallback = (isConnected: boolean, deviceName: string) => {
        this.setState({ isConnecting: false, canStartTesting: isConnected, needsValidation: !isConnected, connectedDevice: deviceName });
    };
}
