// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner } from '@fluentui/react';
import { render } from '@testing-library/react';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    DebugTools,
    DebugToolsViewDeps,
    DebugToolsViewState,
} from 'debug-tools/components/debug-tools-view';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { CurrentView } from '../../../../../debug-tools/components/current-view/current-view';
import { DebugToolsNav } from '../../../../../debug-tools/components/debug-tools-nav';
import { NarrowModeDetector } from '../../../../../DetailsView/components/narrow-mode-detector';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../debug-tools/components/current-view/current-view');
jest.mock('../../../../../debug-tools/components/debug-tools-nav');
jest.mock('../../../../../DetailsView/components/narrow-mode-detector');
jest.mock('@fluentui/react');
describe('DebugToolsView', () => {
    mockReactComponents([DebugToolsNav, CurrentView, NarrowModeDetector, Spinner]);
    describe('renders', () => {
        let storesHubMock: IMock<ClientStoresHub<DebugToolsViewState>>;

        beforeEach(() => {
            storesHubMock = Mock.ofType(ClientStoresHub);
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

            const renderResult = render(<DebugTools deps={deps} storeState={storeState} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
            //In snapshot getting undefined, to avoid the undefined value added below if condition.
            if (hasStoreData) {
                expectMockedComponentPropsToMatchSnapshots([
                    DebugToolsNav,
                    NarrowModeDetector,
                    CurrentView,
                ]);
            } else {
                expect(getMockComponentClassPropsForCall(DebugToolsNav)).toBeUndefined();
                expect(getMockComponentClassPropsForCall(NarrowModeDetector)).toBeUndefined();
                expect(getMockComponentClassPropsForCall(CurrentView)).toBeUndefined();
            }
        });
    });
});
