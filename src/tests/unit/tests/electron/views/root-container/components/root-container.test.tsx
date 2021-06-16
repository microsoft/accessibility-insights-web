// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ViewRoutes } from 'electron/flux/types/window-state-store-data';
import {
    RootContainerDeps,
    RootContainerInternal,
    RootContainerProps,
    RootContainerState,
} from 'electron/views/root-container/components/root-container';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('RootContainer', () => {
    let deps: RootContainerDeps;
    let storeHubMock: IMock<ClientStoresHub<RootContainerState>>;
    let props: RootContainerProps;

    beforeEach(() => {
        storeHubMock = Mock.ofType<ClientStoresHub<RootContainerState>>(BaseClientStoresHub);

        deps = { storesHub: storeHubMock.object } as RootContainerDeps;
        props = {
            deps,
            storeState: {
                windowStateStoreData: {
                    routeId: 'deviceConnectView',
                    currentWindowState: 'customSize',
                },
                userConfigurationStoreData: {
                    isFirstTime: false,
                },
                scanStoreData: {
                    status: ScanStatus.Completed,
                },
                unifiedScanResultStoreData: {
                    rules: [],
                },
                cardSelectionStoreData: {
                    rules: {},
                },
            },
        } as unknown as RootContainerProps;
    });

    describe('renders', () => {
        const routeIds: ViewRoutes[] = ['deviceConnectView', 'resultsView'];

        it.each(routeIds)('with routeId = %s', routeId => {
            props.storeState.windowStateStoreData.routeId = routeId;

            const wrapped = shallow(<RootContainerInternal {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
