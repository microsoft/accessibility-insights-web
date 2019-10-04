import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { WindowStateStore } from 'electron/flux/store/window-state-store';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { DeviceConnectViewContainerState } from 'electron/views/device-connect-view/components/device-connect-view-container';
import {
    RootContainer,
    RootContainerDeps,
    RootContainerProps,
    RootContainerState,
} from 'electron/views/root-container/components/root-container';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Store } from 'common/flux/store';
import { StoreNames } from 'common/stores/store-names';
import { BaseStore } from 'common/base-store';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

describe(RootContainer, () => {
    let windowStateStoreMock: IMock<WindowStateStore>;
    let changeListener: (state: WindowStateStoreData) => Promise<void>;
    let deps: RootContainerDeps;
    let windowStateStoreData: WindowStateStoreData;
    let storesMap: { [key: string]: BaseStore<any> };

    beforeEach(() => {
        windowStateStoreMock = Mock.ofType(WindowStateStore);
        storesMap[StoreNames.WindowStateStore] = windowStateStoreMock.object;
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
        storeHubMock.setup(hub => hub.stores).returns(() => storesMap);
        deps = { storeHub: storeHubMock.object } as RootContainerDeps;

        windowStateStoreMock
            .setup(w => w.addChangedListener(It.isAny()))
            .callback(cb => {
                changeListener = cb;
            });
    });

    it('renders device connect view container when route is deviceConnectView', async () => {
        const props: RootContainerProps = { deps };
        const wrapped = <RootContainer {...props} />;
        windowStateStoreData.routeId = 'deviceConnectView';
        await changeListener(windowStateStoreData);
    });
    it('renders result view container when route is resultView', () => {});
});
