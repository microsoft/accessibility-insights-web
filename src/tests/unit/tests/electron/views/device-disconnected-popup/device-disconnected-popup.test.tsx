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
        it('handles on redetect device', () => {
            const onConnectNewDeviceMock: () => void = jest.fn(() => {});

            const props = {
                onRedetectDevice: onConnectNewDeviceMock,
            } as DeviceDisconnectedPopupProps;

            const wrapper = shallow(<DeviceDisconnectedPopup {...props} />);

            wrapper.find('[text="Redetect device"]').simulate('click');

            expect(onConnectNewDeviceMock).toBeCalledTimes(1);
        });
    });
});
