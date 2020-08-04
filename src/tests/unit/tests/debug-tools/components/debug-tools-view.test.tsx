// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    DebugTools,
    DebugToolsViewDeps,
    DebugToolsViewState,
} from 'debug-tools/components/debug-tools-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

//
describe('DebugToolsView', () => {
    describe('renders', () => {
        let storesHubMock: IMock<ClientStoresHub<DebugToolsViewState>>;

        beforeEach(() => {
            storesHubMock = Mock.ofType<ClientStoresHub<DebugToolsViewState>>(BaseClientStoresHub);
        });

        it.each([true, false])('when storesHub.hasStoresData = %s', hasStoreData => {
            storesHubMock.setup(hub => hub.hasStoreData()).returns(() => hasStoreData);

            const deps = {
                storesHub: storesHubMock.object,
            } as DebugToolsViewDeps;

            const storeState = {
                userConfigurationStoreData: {
                    isFirstTime: true,
                } as UserConfigurationStoreData,
            } as DebugToolsViewState;

            const wrapped = shallow(<DebugTools deps={deps} storeState={storeState} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
