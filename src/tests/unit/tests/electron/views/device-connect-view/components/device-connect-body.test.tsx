// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnumHelper } from 'common/enum-helper';
import { DeviceConnectState } from 'electron/flux/types/device-connect-state';
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import {
    DeviceConnectBody,
    DeviceConnectBodyDeps,
    DeviceConnectBodyProps,
} from 'electron/views/device-connect-view/components/device-connect-body';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectBodyTest', () => {
    const deviceConnectStates = EnumHelper.getNumericValues<DeviceConnectState>(
        DeviceConnectState,
    ).map(state => DeviceConnectState[state]);

    it.each(deviceConnectStates)(`renders, with device connect state = %s`, stateName => {
        const props: DeviceConnectBodyProps = {
            deps: {
                ipcRendererShim: {
                    closeWindow: () => {
                        return;
                    },
                } as IpcRendererShim,
            } as DeviceConnectBodyDeps,
            viewState: {
                connectedDevice: 'Test Device',
                deviceConnectState: DeviceConnectState[stateName],
            },
        } as DeviceConnectBodyProps;

        const wrapped = shallow(<DeviceConnectBody {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
