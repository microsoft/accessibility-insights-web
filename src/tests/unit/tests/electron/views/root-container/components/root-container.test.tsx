// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

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
import { shallow } from 'enzyme';
import { It, Mock } from 'typemoq';

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

    it('renders default view from default route', async () => {
        const props: RootContainerProps = { deps };
        const wrapped = shallow(<RootContainer {...props} />);

        wrapped.instance();
        windowStateStoreData.routeId = 'deviceConnectView';

        expect(wrapped.getElement()).toMatchSnapshot('default view');
    });

    it('renders device connect view container when route is deviceConnectView', async () => {
        const props: RootContainerProps = { deps };
        const wrapped = shallow(<RootContainer {...props} />);

        wrapped.instance();
        windowStateStoreData.routeId = 'deviceConnectView';
        await storeListener();

        expect(wrapped.getElement()).toMatchSnapshot('device connect view');
    });

    it('renders results view container when route is resultsView', async () => {
        const props: RootContainerProps = { deps };
        const wrapped = shallow(<RootContainer {...props} />);

        wrapped.instance();
        windowStateStoreData.routeId = 'resultsView';
        await storeListener();

        expect(wrapped.getElement()).toMatchSnapshot('results view');
    });
});
