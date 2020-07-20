// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectViewContainer', () => {
    it('renders', () => {
        const deps: DeviceConnectViewContainerDeps = {} as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = {
            deps,
            userConfigurationStoreData: {
                isFirstTime: true,
            },
            windowStateStoreData: {
                currentWindowState: 'customSize',
                routeId: 'deviceConnectView',
            },
            androidSetupStoreData: {
                currentStepId: 'detect-adb',
            },
        } as DeviceConnectViewContainerProps;

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
