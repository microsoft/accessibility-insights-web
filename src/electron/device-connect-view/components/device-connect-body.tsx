// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import * as React from 'react';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter } from './device-connect-footer';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry, DeviceConnectPortEntryDeps } from './device-connect-port-entry';
import { DeviceConnectState } from './device-connect-state';

export type UpdateStateCallback = (newState: DeviceConnectState, deviceName?: string) => void;

export type DeviceConnectBodyDeps = {
    currentWindow: BrowserWindow;
} & DeviceConnectPortEntryDeps;

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
                    deps={this.props.deps}
                    needsValidation={needsValidation}
                    updateStateCallback={this.OnConnectedCallback}
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
