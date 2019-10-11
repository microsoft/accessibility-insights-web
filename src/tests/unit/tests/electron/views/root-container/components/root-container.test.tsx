// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { DeviceConnectState } from 'electron/views/device-connect-view/components/device-connect-state';
import {
    RootContainer,
    RootContainerDeps,
    RootContainerProps,
    RootContainerState,
} from 'electron/views/root-container/components/root-container';
import { shallow } from 'enzyme';
import { isFunction } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock } from 'typemoq';

describe(RootContainer, () => {
    let deps: RootContainerDeps;
    let storeHubMock: IMock<ClientStoresHub<RootContainerState>>;
    let props: RootContainerProps;

    beforeEach(() => {
        storeHubMock = Mock.ofType<ClientStoresHub<RootContainerState>>(BaseClientStoresHub);

        deps = { storeHub: storeHubMock.object } as RootContainerDeps;
        props = {
            deps,
        } as RootContainerProps;
    });

    //

    describe('renders', () => {
        it('device connect view container when route is deviceConnectView', () => {
            storeHubMock
                .setup(hub => hub.getAllStoreData())
                .returns(() => {
                    return {
                        windowStateStoreData: { routeId: 'deviceConnectView', currentWindowState: 'restoredOrMaximized' },
                        userConfigurationStoreData: { isFirstTime: true },
                        deviceStoreData: { deviceConnectState: DeviceConnectState.Connected },
                    } as RootContainerState;
                });

            const wrapped = shallow(<RootContainer {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('results view container when route is resultsView', () => {
            storeHubMock
                .setup(hub => hub.getAllStoreData())
                .returns(() => {
                    return {
                        windowStateStoreData: { routeId: 'resultsView', currentWindowState: 'restoredOrMaximized' },
                        userConfigurationStoreData: { isFirstTime: true },
                        deviceStoreData: { deviceConnectState: DeviceConnectState.Connected, port: 11111 },
                    } as RootContainerState;
                });

            const wrapped = shallow(<RootContainer {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('store listening', () => {
        it('uses the store to update the state', () => {
            storeHubMock
                .setup(hub => hub.getAllStoreData())
                .returns(() => {
                    return {
                        windowStateStoreData: { routeId: 'deviceConnectView', currentWindowState: 'restoredOrMaximized' },
                        userConfigurationStoreData: { isFirstTime: true },
                        deviceStoreData: { deviceConnectState: DeviceConnectState.Connected },
                    } as RootContainerState;
                });
            storeHubMock
                .setup(hub => hub.getAllStoreData())
                .returns(() => {
                    return {
                        windowStateStoreData: { routeId: 'resultsView', currentWindowState: 'restoredOrMaximized' },
                        userConfigurationStoreData: { isFirstTime: true },
                        deviceStoreData: { deviceConnectState: DeviceConnectState.Connected },
                    } as RootContainerState;
                });
            let storeListener: Function;
            storeHubMock
                .setup(hub => hub.addChangedListenerToAllStores(It.is(isFunction)))
                .callback(cb => {
                    storeListener = cb;
                });

            const wrapped = shallow(<RootContainer {...props} />);
            expect(wrapped.state()).toMatchSnapshot('initial state');

            storeListener();
            expect(wrapped.state()).toMatchSnapshot('updated state');
        });
    });
});
