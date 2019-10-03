// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DeviceConnectConnectedDevice,
    DeviceConnectConnectedDeviceProps,
} from 'electron/views/device-connect-view/components/device-connect-connected-device';
import { DeviceConnectState } from 'electron/views/device-connect-view/components/device-connect-state';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectConnectedDeviceTest', () => {
    const testProps = [
        [
            'no content',
            {
                deviceConnectState: DeviceConnectState.Default,
            },
        ],
        [
            'user change the port number',
            {
                connectedDevice: 'A Test Device!',
                deviceConnectState: DeviceConnectState.Default,
            },
        ],
        [
            'scanning spinner',
            {
                deviceConnectState: DeviceConnectState.Connecting,
            },
        ],
        [
            'connection success',
            {
                connectedDevice: 'A Test Device!',
                deviceConnectState: DeviceConnectState.Connected,
            },
        ],
        [
            'connection failure',
            {
                deviceConnectState: DeviceConnectState.Error,
            },
        ],
    ];

    test.each(testProps)('render %s', (testName: string, props: DeviceConnectConnectedDeviceProps) => {
        const rendered = shallow(<DeviceConnectConnectedDevice {...props} />);

        expect(rendered.getElement()).toMatchSnapshot(testName);
    });
});
