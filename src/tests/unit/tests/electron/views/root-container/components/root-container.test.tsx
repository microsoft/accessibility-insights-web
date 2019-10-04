// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import { BaseStore } from 'common/base-store';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { StoreNames } from 'common/stores/store-names';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { DeviceConnectViewContainerState } from 'electron/views/device-connect-view/components/device-connect-view-container';
import {
    RootContainer,
    RootContainerDeps,
    RootContainerProps,
    RootContainerState,
} from 'electron/views/root-container/components/root-container';
import { shallow } from 'enzyme';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe(RootContainer, () => {
    let storeListener: () => Promise<void>;
    let deps: RootContainerDeps;
    let windowStateStoreData: WindowStateStoreData;

    beforeEach(() => {
        windowStateStoreData = {
            routeId: 'deviceConnectView',
        };

        const storeHubMock = Mock.ofType<
            ClientStoresHub<DeviceConnectViewContainerState> & ClientStoresHub<WindowStateStore> & ClientStoresHub<RootContainerState>
        >(BaseClientStoresHub as any);
        storeHubMock
            .setup(hub => hub.getAllStoreData())
            .returns(() => {
                return { windowStateStoreData } as any;
            });
        storeHubMock
            .setup(w => w.addChangedListenerToAllStores(It.isAny()))
            .callback(cb => {
                storeListener = cb;
            });

        deps = { storeHub: storeHubMock.object } as any;
    });

    it('renders device connect view container when route is deviceConnectView', async () => {
        const props: RootContainerProps = { deps };
        const wrapped = <RootContainer {...props} />;
        windowStateStoreData.routeId = 'deviceConnectView';
        await storeListener();

        expect(shallow(wrapped)).toMatchSnapshot();
    });
    it('renders result view container when route is resultView', async () => {
        const props: RootContainerProps = { deps };
        const wrapped = <RootContainer {...props} />;
        windowStateStoreData.routeId = 'resultsView';
        await storeListener();

        expect(shallow(wrapped)).toMatchSnapshot();
    });
});
