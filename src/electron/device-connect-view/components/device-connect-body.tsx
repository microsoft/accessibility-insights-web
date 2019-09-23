// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import { fetchScanResults } from '../../platform/android/fetch-scan-results';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter } from './device-connect-footer';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry } from './device-connect-port-entry';

export type UpdateStateCallback = (newState: DeviceConnectState, deviceName?: string) => void;

export enum DeviceConnectState {
    Default,
    Connecting,
    Connected,
    Error,
}

export type DeviceConnectBodyDeps = {
    currentWindow: BrowserWindow;
};

export interface DeviceConnectBodyProps {
    deps: DeviceConnectBodyDeps;
}

export interface DeviceConnectBodyState {
    deviceConnectState: DeviceConnectState;
    connectedDevice?: string;
}

export class DeviceConnectBody extends React.Component<DeviceConnectBodyProps, DeviceConnectBodyState> {
    constructor(props: DeviceConnectBodyProps) {
        super(props);
        this.state = {
            deviceConnectState: DeviceConnectState.Default,
        };
    }

    public render(): JSX.Element {
        const needsValidation = this.state.deviceConnectState !== DeviceConnectState.Connected;
        const isConnecting = this.state.deviceConnectState === DeviceConnectState.Connecting;
        const hasFailedConnecting = this.state.deviceConnectState === DeviceConnectState.Error;
        const canStartTesting = this.state.deviceConnectState === DeviceConnectState.Connected;

        return (
            <div className="device-connect-body">
                <DeviceConnectHeader />
                <DeviceConnectPortEntry
                    deps={{
                        updateStateCallback: this.OnConnectedCallback,
                        fetchScanResults: fetchScanResults,
                    }}
                    needsValidation={needsValidation}
                />
                <DeviceConnectConnectedDevice
                    isConnecting={isConnecting}
                    connectedDevice={this.state.connectedDevice}
                    hasFailed={hasFailedConnecting}
                />
                <DeviceConnectFooter
                    cancelClick={this.props.deps.currentWindow.close}
                    canStartTesting={canStartTesting}
                ></DeviceConnectFooter>
            </div>
        );
    }

    private OnConnectedCallback: UpdateStateCallback = (newState: DeviceConnectState, deviceName?: string) => {
        this.setState({
            deviceConnectState: newState,
            connectedDevice: deviceName,
        });
    };
}
