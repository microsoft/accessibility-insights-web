// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import {
    CurrentView,
    CurrentViewDeps,
    CurrentViewProps,
    CurrentViewState,
} from 'debug-tools/components/current-view/current-view';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';
import * as React from 'react';
import { StoresTree } from '../../../../../../debug-tools/components/stores-tree';
import { TelemetryViewer } from '../../../../../../debug-tools/components/telemetry-viewer/telemetry-viewer';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../debug-tools/components/telemetry-viewer/telemetry-viewer');
jest.mock('../../../../../../debug-tools/components/stores-tree');
describe('CurrentView', () => {
    mockReactComponents([TelemetryViewer, StoresTree]);
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

        const renderResult = render(<CurrentView {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        //needs to review below condition
        //In snapshot getting undefined, to avoid the undefined value added below if else condition.
        if (selectedTool === 'stores') expectMockedComponentPropsToMatchSnapshots([StoresTree]);
        else expectMockedComponentPropsToMatchSnapshots([TelemetryViewer]);
    });
});
