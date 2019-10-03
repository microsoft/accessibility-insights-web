// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { BrowserWindow } from 'electron';
import { DeviceConnectState } from 'electron/views/device-connect-view/components/device-connect-state';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
    DeviceConnectViewContainerState,
} from 'electron/views/device-connect-view/components/device-connect-view-container';
import { shallow } from 'enzyme';
import { isFunction } from 'lodash';
import * as React from 'react';
import { It, Mock } from 'typemoq';

describe('DeviceConnectViewContainer', () => {
    const currentWindowStub = {
        close: () => {
            return;
        },
    } as BrowserWindow;

    it('renders', () => {
        const storeHubMock = Mock.ofType<ClientStoresHub<DeviceConnectViewContainerState>>(BaseClientStoresHub);
        storeHubMock
            .setup(hub => hub.getAllStoreData())
            .returns(() => {
                return {
                    userConfigurationStoreData: {
                        isFirstTime: true,
                    },
                    deviceStoreData: {
                        deviceConnectState: DeviceConnectState.Default,
                    },
                } as DeviceConnectViewContainerState;
            });

        const deps: DeviceConnectViewContainerDeps = {
            currentWindow: currentWindowStub,
            storeHub: storeHubMock.object,
        } as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('listens to store changes through the stores hub', () => {
        const storeHubMock = Mock.ofType<ClientStoresHub<DeviceConnectViewContainerState>>(BaseClientStoresHub);

        storeHubMock
            .setup(hub => hub.getAllStoreData())
            .returns(() => {
                return {
                    userConfigurationStoreData: {
                        isFirstTime: true,
                        enableTelemetry: false,
                    },
                    deviceStoreData: {
                        deviceConnectState: DeviceConnectState.Default,
                    },
                } as DeviceConnectViewContainerState;
            });

        storeHubMock
            .setup(hub => hub.getAllStoreData())
            .returns(() => {
                return {
                    userConfigurationStoreData: {
                        isFirstTime: false,
                        enableTelemetry: true,
                    },
                    deviceStoreData: {
                        deviceConnectState: DeviceConnectState.Default,
                    },
                } as DeviceConnectViewContainerState;
            });

        let storeListener: Function;

        storeHubMock.setup(hub => hub.addChangedListenerToAllStores(It.is(isFunction))).callback(listener => (storeListener = listener));

        const deps: DeviceConnectViewContainerDeps = {
            storeHub: storeHubMock.object,
        } as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.instance().state).toMatchSnapshot('state from constructor');

        storeListener();

        expect(wrapped.instance().state).toMatchSnapshot('updated state');
    });
});
