// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    columns,
    StoresTree,
    StoresTreeDeps,
    StoresTreeProps,
    StoresTreeState,
} from 'debug-tools/components/stores-tree';
import { shallow } from 'enzyme';
import { GroupedList } from '@fluentui/react';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('StoresTree', () => {
    describe('renders', () => {
        const storesHubMock = Mock.ofType<ClientStoresHub<StoresTreeState>>();

        it('with no data from the state', () => {
            storesHubMock.setup(hub => hub.hasStoreData()).returns(() => false);

            const deps = {
                storesHub: storesHubMock.object,
            } as StoresTreeDeps;

            const props = {
                deps,
            } as StoresTreeProps;

            const wrapped = shallow(<StoresTree {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('with proper data from the stores', () => {
            storesHubMock.setup(hub => hub.hasStoreData()).returns(() => true);

            const deps = {
                storesHub: storesHubMock.object,
            } as StoresTreeDeps;

            const props = {
                deps,
                state: {
                    userConfigurationStoreData: {
                        enableTelemetry: true,
                        isFirstTime: false,
                    } as UserConfigurationStoreData,
                    permissionsStateStoreData: {
                        hasAllUrlAndFilePermissions: true,
                    } as PermissionsStateStoreData,
                },
            } as StoresTreeProps;

            const wrapped = shallow(<StoresTree {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('the value column properly', () => {
            const onRender = columns.find(column => column.key === 'value').onRender;

            const testItem = {
                first: 1,
                second: '2',
                third: true,
                fourth: [4],
                fifth: {
                    sixth: '6',
                },
            };

            const result = onRender({ value: testItem });

            expect(result).toMatchSnapshot();
        });

        it('each row properly', () => {
            storesHubMock.setup(hub => hub.hasStoreData()).returns(() => true);

            const deps = {
                storesHub: storesHubMock.object,
            } as StoresTreeDeps;

            const props = {
                deps,
            } as StoresTreeProps;

            const wrapped = shallow(<StoresTree {...props} />);

            const list = wrapped.find(GroupedList);

            const onRenderCell = list.prop('onRenderCell');

            const testItem = {
                key: 'value',
            };

            expect(onRenderCell(0, testItem, 1)).toMatchSnapshot();
        });
    });
});
