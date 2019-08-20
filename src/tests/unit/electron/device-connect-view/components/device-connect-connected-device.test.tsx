// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    DeviceConnectConnectedDevice,
    DeviceConnectConnectedDeviceProps,
} from '../../../../../electron/device-connect-view/components/device-connect-connected-device';

describe('DeviceConnectConnectedDeviceTest', () => {
    test('render, no content', () => {
        const props: DeviceConnectConnectedDeviceProps = {
            isConnecting: false,
        };

        validateRenderWithProps(props, 'no content');
    });

    test('render, spinner', () => {
        const props: DeviceConnectConnectedDeviceProps = {
            isConnecting: true,
        };

        validateRenderWithProps(props, 'no content');
    });

    test('render, device', () => {
        const props: DeviceConnectConnectedDeviceProps = {
            isConnecting: false,
            connectedDevice: 'A Test Device!',
        };

        validateRenderWithProps(props, 'no content');
    });

    function validateRenderWithProps(props: DeviceConnectConnectedDeviceProps, testname: string): void {
        const rendered = shallow(<DeviceConnectConnectedDevice {...props} />);

        expect(rendered.getElement()).toMatchSnapshot(testname);
    }
});
