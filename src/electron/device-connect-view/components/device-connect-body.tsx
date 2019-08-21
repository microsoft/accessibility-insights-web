// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import { fetchScanResults } from '../../platform/android/fetch-scan-results';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter } from './device-connect-footer';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry } from './device-connect-port-entry';

export type OnConnectedCallback = (isConnected: boolean, hasFailedConnecting: boolean, deviceName?: string) => void;
export type OnConnectingCallback = () => void;

export interface DeviceConnectBodyProps {
    currentWindow: BrowserWindow;
}

export interface DeviceConnectBodyState {
    canStartTesting: boolean;
    hasFailedConnecting: boolean;
    isConnecting: boolean;
    needsValidation: boolean;
    connectedDevice?: string;
}

export class DeviceConnectBody extends React.Component<DeviceConnectBodyProps, DeviceConnectBodyState> {
    constructor(props: DeviceConnectBodyProps) {
        super(props);
        this.state = {
            canStartTesting: false,
            hasFailedConnecting: false,
            isConnecting: false,
            needsValidation: true,
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
                    fetchScanResults={fetchScanResults}
                />
                <DeviceConnectConnectedDevice
                    isConnecting={this.state.isConnecting}
                    connectedDevice={this.state.connectedDevice}
                    hasFailed={this.state.hasFailedConnecting}
                />
                <DeviceConnectFooter
                    cancelClick={this.props.currentWindow.close}
                    canStartTesting={this.state.canStartTesting}
                ></DeviceConnectFooter>
            </div>
        );
    }

    private OnConnectingCallback: OnConnectingCallback = () => {
        this.setState({
            canStartTesting: false,
            connectedDevice: '',
            hasFailedConnecting: false,
            isConnecting: true,
            needsValidation: true,
        });
    };

    private OnConnectedCallback: OnConnectedCallback = (isConnected: boolean, hasFailedConnecting: boolean, deviceName?: string) => {
        this.setState({
            canStartTesting: isConnected,
            connectedDevice: deviceName,
            hasFailedConnecting: hasFailedConnecting,
            isConnecting: false,
            needsValidation: !isConnected,
        });
    };
}
