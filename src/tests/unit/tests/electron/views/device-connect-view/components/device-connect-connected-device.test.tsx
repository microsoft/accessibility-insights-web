// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectState } from 'electron/flux/types/device-connect-state';
import {
    DeviceConnectConnectedDevice,
    DeviceConnectConnectedDeviceProps,
} from 'electron/views/device-connect-view/components/device-connect-connected-device';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectConnectedDeviceTest', () => {
    it.each`
        state
        ${DeviceConnectState[DeviceConnectState.Connecting]}
        ${DeviceConnectState[DeviceConnectState.Error]}
        ${DeviceConnectState[DeviceConnectState.Default]}
        ${DeviceConnectState[DeviceConnectState.Connected]}
    `('renders for deviceConnectState = $state', ({ state }) => {
        const props: DeviceConnectConnectedDeviceProps = {
            deviceConnectState: DeviceConnectState[state as string],
        };

        const rendered = shallow(<DeviceConnectConnectedDevice {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders the device name when state is connected', () => {
        const props: DeviceConnectConnectedDeviceProps = {
            deviceConnectState: DeviceConnectState.Connected,
            connectedDevice: 'test-device',
        };

        const rendered = shallow(<DeviceConnectConnectedDevice {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
