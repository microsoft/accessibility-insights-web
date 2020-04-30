// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import * as React from 'react';

import { DeviceConnectState } from '../../../flux/types/device-connect-state';
import * as styles from './device-connect-body.scss';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectFooter, DeviceConnectFooterDeps } from './device-connect-footer';
import { DeviceConnectHeader, DeviceConnectHeaderDeps } from './device-connect-header';
import {
    DeviceConnectPortEntry,
    DeviceConnectPortEntryDeps,
    DeviceConnectPortEntryViewState,
} from './device-connect-port-entry';

export type UpdateStateCallback = (newState: DeviceConnectState, deviceName?: string) => void;

export type DeviceConnectBodyState = DeviceConnectPortEntryViewState & {
    connectedDevice?: string;
};

export type DeviceConnectBodyDeps = {
    ipcRendererShim: IpcRendererShim;
} & DeviceConnectPortEntryDeps &
    DeviceConnectFooterDeps &
    DeviceConnectHeaderDeps;

export interface DeviceConnectBodyProps {
    deps: DeviceConnectBodyDeps;
    viewState: DeviceConnectBodyState;
}

export const DeviceConnectBody = NamedFC<DeviceConnectBodyProps>('DeviceConnectBody', props => {
    const canStartTesting = props.viewState.deviceConnectState === DeviceConnectState.Connected;

    return (
        <div className={styles.deviceConnectBody}>
            <DeviceConnectHeader deps={props.deps} />
            <DeviceConnectPortEntry
                deps={props.deps}
                viewState={{ deviceConnectState: props.viewState.deviceConnectState }}
            />
            <DeviceConnectConnectedDevice
                connectedDevice={props.viewState.connectedDevice}
                deviceConnectState={props.viewState.deviceConnectState}
            />
            <DeviceConnectFooter
                deps={props.deps}
                cancelClick={props.deps.ipcRendererShim.closeWindow}
                canStartTesting={canStartTesting}
            ></DeviceConnectFooter>
        </div>
    );
});
