// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { DetailsRow, FocusZone, GroupedList, SelectionZone, Spinner } from '@fluentui/react';
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
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('StoresTree', () => {
    mockReactComponents([GroupedList, DetailsRow, SelectionZone, FocusZone, Spinner]);
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

            const renderResult = render(<StoresTree {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
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

            const renderResult = render(<StoresTree {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([FocusZone]);
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

            render(<StoresTree {...props} />);

            const list = getMockComponentClassPropsForCall(GroupedList);

            const onRenderCell = list.onRenderCell;

            const testItem = {
                key: 'value',
            };

            expect(onRenderCell(0, testItem, 1)).toMatchSnapshot();
        });
    });
});
