// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import {
    DeviceConnectBody,
    DeviceConnectBodyDeps,
    DeviceConnectBodyProps,
} from 'electron/device-connect-view/components/device-connect-body';
import { DeviceConnectState } from 'electron/device-connect-view/components/device-connect-state';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectBodyTest', () => {
    const deviceConnectStates = [
        DeviceConnectState[DeviceConnectState.Connected],
        DeviceConnectState[DeviceConnectState.Connecting],
        DeviceConnectState[DeviceConnectState.Default],
        DeviceConnectState[DeviceConnectState.Error],
    ];

    it.each(deviceConnectStates)(`renders, with device connect state = %s`, stateName => {
        const props: DeviceConnectBodyProps = {
            deps: {
                currentWindow: {
                    close: () => {
                        return;
                    },
                } as BrowserWindow,
            } as DeviceConnectBodyDeps,
            viewState: {
                deviceConnectState: DeviceConnectState[stateName],
            },
        } as DeviceConnectBodyProps;

        const wrapped = shallow(<DeviceConnectBody {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
