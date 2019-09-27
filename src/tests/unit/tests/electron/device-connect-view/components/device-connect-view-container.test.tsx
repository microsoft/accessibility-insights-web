// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { BaseStore } from 'common/base-store';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { BrowserWindow } from 'electron';
import { DeviceConnectState } from 'electron/device-connect-view/components/device-connect-state';
import {
    DeviceConnectViewContainer,
    DeviceConnectViewContainerDeps,
    DeviceConnectViewContainerProps,
} from 'electron/device-connect-view/components/device-connect-view-container';
import { DeviceStore } from 'electron/flux/store/device-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
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
        const userConfigurationStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>(UserConfigurationStore);

        userConfigurationStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isFirstTime: true,
                } as UserConfigurationStoreData;
            });

        const deviceStoreMock = Mock.ofType<BaseStore<DeviceStoreData>>(DeviceStore);

        deviceStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    deviceConnectState: DeviceConnectState.Default,
                } as DeviceStoreData;
            });

        const deps: DeviceConnectViewContainerDeps = {
            currentWindow: currentWindowStub,
            userConfigurationStore: userConfigurationStoreMock.object,
            deviceStore: deviceStoreMock.object,
        } as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('listens to user configuration store', () => {
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

        const deviceStoreMock = Mock.ofType<BaseStore<DeviceStoreData>>();

        deviceStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    deviceConnectState: DeviceConnectState.Default,
                } as DeviceStoreData;
            });

        let storeListener: Function;

        userConfigurationStoreMock
            .setup(store => store.addChangedListener(It.is(isFunction)))
            .callback(listener => {
                storeListener = listener;
            });

        const deps: DeviceConnectViewContainerDeps = {
            userConfigurationStore: userConfigurationStoreMock.object,
            deviceStore: deviceStoreMock.object,
        } as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.instance().state).toMatchSnapshot('state from constructor');

        storeListener();

        expect(wrapped.instance().state).toMatchSnapshot('updated state');
    });

    it('listens to device store', () => {
        const userConfigurationStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>();

        userConfigurationStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isFirstTime: true,
                    enableTelemetry: false,
                } as UserConfigurationStoreData;
            });

        const deviceStoreMock = Mock.ofType<BaseStore<DeviceStoreData>>(DeviceStore);

        deviceStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    deviceConnectState: DeviceConnectState.Default,
                } as DeviceStoreData;
            });

        deviceStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    deviceConnectState: DeviceConnectState.Connecting,
                } as DeviceStoreData;
            });

        let storeListener: Function;

        deviceStoreMock
            .setup(store => store.addChangedListener(It.is(isFunction)))
            .callback(listener => {
                storeListener = listener;
            });

        const deps: DeviceConnectViewContainerDeps = {
            userConfigurationStore: userConfigurationStoreMock.object,
            deviceStore: deviceStoreMock.object,
        } as DeviceConnectViewContainerDeps;

        const props: DeviceConnectViewContainerProps = { deps };

        const wrapped = shallow(<DeviceConnectViewContainer {...props} />);

        expect(wrapped.instance().state).toMatchSnapshot('state from constructor');

        storeListener();

        expect(wrapped.instance().state).toMatchSnapshot('updated state');
    });
});
