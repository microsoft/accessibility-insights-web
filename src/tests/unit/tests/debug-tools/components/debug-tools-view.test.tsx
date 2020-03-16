// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    DebugTools,
    DebugToolsViewDeps,
    DebugToolsViewState,
} from 'debug-tools/components/debug-tools-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DebugToolsView', () => {
    it('renders', () => {
        const deps = {
            storesHub: null,
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
