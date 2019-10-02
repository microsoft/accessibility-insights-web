// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { BrowserWindow } from 'electron';
import * as React from 'react';

import { deviceConnectBody } from './device-connect-body.scss';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter } from './device-connect-footer';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry, DeviceConnectPortEntryDeps, DeviceConnectPortEntryViewState } from './device-connect-port-entry';
import { DeviceConnectState } from './device-connect-state';

export type UpdateStateCallback = (newState: DeviceConnectState, deviceName?: string) => void;

export type DeviceConnectBodyState = DeviceConnectPortEntryViewState & {
    connectedDevice?: string;
};

export type DeviceConnectBodyDeps = {
    currentWindow: BrowserWindow;
} & DeviceConnectPortEntryDeps;

export interface DeviceConnectBodyProps {
    deps: DeviceConnectBodyDeps;
    viewState: DeviceConnectBodyState;
}

export const DeviceConnectBody = NamedFC<DeviceConnectBodyProps>('DeviceConnectBody', props => {
    const canStartTesting = props.viewState.deviceConnectState === DeviceConnectState.Connected;

    return (
        <div className={deviceConnectBody}>
            <DeviceConnectHeader />
            <DeviceConnectPortEntry deps={props.deps} viewState={{ deviceConnectState: props.viewState.deviceConnectState }} />
            <DeviceConnectConnectedDevice
                connectedDevice={props.viewState.connectedDevice}
                deviceConnectState={props.viewState.deviceConnectState}
            />
            <DeviceConnectFooter cancelClick={props.deps.currentWindow.close} canStartTesting={canStartTesting}></DeviceConnectFooter>
        </div>
    );
});
