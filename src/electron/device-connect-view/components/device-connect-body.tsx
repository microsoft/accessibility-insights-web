// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { BrowserWindow } from 'electron';
import * as React from 'react';

import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter } from './device-connect-footer';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry, DeviceConnectPortEntryDeps } from './device-connect-port-entry';
import { DeviceConnectState } from './device-connect-state';

export type UpdateStateCallback = (newState: DeviceConnectState, deviceName?: string) => void;

export interface DeviceConnectBodyState {
    deviceConnectState: DeviceConnectState;
    connectedDevice?: string;
}

export type DeviceConnectBodyDeps = {
    currentWindow: BrowserWindow;
} & DeviceConnectPortEntryDeps;

export interface DeviceConnectBodyProps {
    deps: DeviceConnectBodyDeps;
    viewState: DeviceConnectBodyState;
}

export const DeviceConnectBody = NamedFC<DeviceConnectBodyProps>('DeviceConnectBody', props => {
    const needsValidation = props.viewState.deviceConnectState !== DeviceConnectState.Connected;
    const isConnecting = props.viewState.deviceConnectState === DeviceConnectState.Connecting;
    const hasFailedConnecting = props.viewState.deviceConnectState === DeviceConnectState.Error;
    const canStartTesting = props.viewState.deviceConnectState === DeviceConnectState.Connected;

    return (
        <div className="device-connect-body">
            <DeviceConnectHeader />
            <DeviceConnectPortEntry deps={props.deps} needsValidation={needsValidation} />
            <DeviceConnectConnectedDevice
                isConnecting={isConnecting}
                connectedDevice={props.viewState.connectedDevice}
                hasFailed={hasFailedConnecting}
            />
            <DeviceConnectFooter cancelClick={props.deps.currentWindow.close} canStartTesting={canStartTesting}></DeviceConnectFooter>
        </div>
    );
});
