// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DeviceDisconnectedPopup,
    DeviceDisconnectedPopupProps,
} from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceDisconnectedPopup', () => {
    it('renders', () => {
        const props = {
            deviceName: 'test device name',
        } as DeviceDisconnectedPopupProps;
        const wrapper = shallow(<DeviceDisconnectedPopup {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('user interaction', () => {
        it('handles on connect a new device', () => {
            const onConnectNewDeviceMock: () => void = jest.fn(() => {});

            const props = {
                onConnectNewDevice: onConnectNewDeviceMock,
            } as DeviceDisconnectedPopupProps;

            const wrapper = shallow(<DeviceDisconnectedPopup {...props} />);

            wrapper.find('[text="Connect a new device"]').simulate('click');

            expect(onConnectNewDeviceMock).toBeCalledTimes(1);
        });

        it('handles on rescan device', () => {
            const onRescanDeviceMock: () => void = jest.fn(() => {});

            const props = {
                onRescanDevice: onRescanDeviceMock,
            } as DeviceDisconnectedPopupProps;

            const wrapper = shallow(<DeviceDisconnectedPopup {...props} />);

            wrapper.find('[text="Start over"]').simulate('click');

            expect(onRescanDeviceMock).toBeCalledTimes(1);
        });
    });
});
