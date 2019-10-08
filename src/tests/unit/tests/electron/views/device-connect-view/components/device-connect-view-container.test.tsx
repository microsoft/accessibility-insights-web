// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { DeviceConnectState } from 'electron/views/device-connect-view/components/device-connect-state';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectViewContainer', () => {
    const currentWindowStub = {
        close: () => {
            return;
        },
    } as BrowserWindow;

    it('renders', () => {
        const deps: DeviceConnectViewContainerDeps = {
            currentWindow: currentWindowStub,
        } as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = {
            deps,
            userConfigurationStoreData: {
                isFirstTime: true,
            },
            deviceStoreData: {
                deviceConnectState: DeviceConnectState.Default,
            },
        } as DeviceConnectViewContainerProps;

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
