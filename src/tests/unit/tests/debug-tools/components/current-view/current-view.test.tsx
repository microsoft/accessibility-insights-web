// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    CurrentView,
    CurrentViewDeps,
    CurrentViewProps,
    CurrentViewState,
} from 'debug-tools/components/current-view/current-view';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('CurrentView', () => {
    const selectedToolValues: ToolsNavKey[] = ['stores', 'telemetryViewer'];

    it.each(selectedToolValues)('renders for selected tool = %s', selectedTool => {
        const props: CurrentViewProps = {
            deps: {} as CurrentViewDeps,
            storeState: {
                debugToolsNavStoreData: {
                    selectedTool,
                },
            } as CurrentViewState,
        };

        const wrapped = shallow(<CurrentView {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
