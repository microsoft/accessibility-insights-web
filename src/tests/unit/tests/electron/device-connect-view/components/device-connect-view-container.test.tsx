// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from '../../../../../../electron/device-connect-view/components/device-connect-view-container';

describe('DeviceConnectViewContainer', () => {
    it('renders', () => {
        const currentWindowStub = {
            close: () => {
                return;
            },
        } as BrowserWindow;

        const deps: DeviceConnectViewContainerDeps = {
            currentWindow: currentWindowStub,
        };

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
