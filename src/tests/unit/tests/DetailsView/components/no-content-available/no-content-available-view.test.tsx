// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    NoContentAvailableView,
    NoContentAvailableViewDeps,
} from 'DetailsView/components/no-content-available/no-content-available-view';
import * as React from 'react';
import { NarrowModeDetector } from '../../../../../../DetailsView/components/narrow-mode-detector';
import { NoContentAvailable } from '../../../../../../DetailsView/components/no-content-available/no-content-available';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../DetailsView/components/narrow-mode-detector');
jest.mock('../../../../../../DetailsView/components/no-content-available/no-content-available');
describe('NoContentAvailableView', () => {
    mockReactComponents([NarrowModeDetector, NoContentAvailable]);
    it('renders', () => {
        const depsStub: NoContentAvailableViewDeps = {
            textContent: {
                applicationTitle: 'test-application-title',
            },
        } as NoContentAvailableViewDeps;

        const renderResult = render(<NoContentAvailableView deps={depsStub} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
    });
});
