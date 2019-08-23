// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DeviceConnectConnectedDevice,
    DeviceConnectConnectedDeviceProps,
} from 'electron/device-connect-view/components/device-connect-connected-device';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectConnectedDeviceTest', () => {
    const testProps = [
        [
            'no content',
            {
                isConnecting: false,
                hasFailed: false,
            },
        ],
        [
            'scanning spinner',
            {
                isConnecting: true,
                hasFailed: false,
            },
        ],
        [
            'connection success',
            {
                isConnecting: false,
                hasFailed: false,
                connectedDevice: 'A Test Device!',
            },
        ],
        [
            'connection failure',
            {
                isConnecting: false,
                hasFailed: true,
            },
        ],
    ];

    test.each(testProps)('render %s', (testName: string, props: DeviceConnectConnectedDeviceProps) =>
        validateRenderWithProps(testName, props),
    );

    function validateRenderWithProps(testname: string, props: DeviceConnectConnectedDeviceProps): void {
        const rendered = shallow(<DeviceConnectConnectedDevice {...props} />);

        expect(rendered.getElement()).toMatchSnapshot(testname);
    }
});
