// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserWindow } from 'electron';
import { shallow } from 'enzyme';
import { isFunction } from 'lodash';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';
import { BaseStore } from '../../../../../../common/base-store';
import { UserConfigurationStoreData } from '../../../../../../common/types/store-data/user-configuration-store';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from '../../../../../../electron/device-connect-view/components/device-connect-view-container';

describe('DeviceConnectViewContainer', () => {
    const currentWindowStub = {
        close: () => {
            return;
        },
    } as BrowserWindow;

    it('renders', () => {
        const deps: DeviceConnectViewContainerDeps = {
            currentWindow: currentWindowStub,
            userConfigurationStore: Mock.ofType<BaseStore<UserConfigurationStoreData>>().object,
        };

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('listen to user configuration store', () => {
        const userConfigurationStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>();

        userConfigurationStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isFirstTime: true,
                    enableTelemetry: false,
                } as UserConfigurationStoreData;
            });

        userConfigurationStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isFirstTime: false,
                    enableTelemetry: true,
                } as UserConfigurationStoreData;
            });

        let storeListener: Function;

        userConfigurationStoreMock
            .setup(store => store.addChangedListener(It.is(isFunction)))
            .callback(listener => {
                storeListener = listener;
            });

        const deps: DeviceConnectViewContainerDeps = {
            currentWindow: currentWindowStub,
            userConfigurationStore: userConfigurationStoreMock.object,
        };

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.instance().state).toMatchSnapshot('state from constructor');

        storeListener();

        expect(wrapped.instance().state).toMatchSnapshot('updated state');
    });
});
