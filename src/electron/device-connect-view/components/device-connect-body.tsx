// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { DeviceConnectConnectedDevice } from './device-connect-connected-device';
import { DeviceConnectHeader } from './device-connect-header';
import { DeviceConnectPortEntry } from './device-connect-port-entry';

export interface DeviceConnectBodyProps {}

export const DeviceConnectBody = NamedSFC<DeviceConnectBodyProps>('DeviceConnectBody', (props: DeviceConnectBodyProps) => {
    return (
        <div className="device-connect-body">
            <DeviceConnectHeader />
            <DeviceConnectPortEntry NeedsValidation={true} />
            <DeviceConnectConnectedDevice IsConnecting={false} ConnectedDevice="Fred the device" />
        </div>
    );
});
