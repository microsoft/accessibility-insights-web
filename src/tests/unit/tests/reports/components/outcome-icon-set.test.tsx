// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { OutcomeIcon } from 'reports/components/outcome-icon';
import { OutcomeIconSet } from 'reports/components/outcome-icon-set';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('reports/components/outcome-icon');
describe('OutcomeIconSet', () => {
    describe('render', () => {
        mockReactComponents([OutcomeIcon]);
        test('render with all properties', () => {
            const renderResult = render(<OutcomeIconSet pass={3} incomplete={2} fail={4} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([OutcomeIcon]);
        });

        test('render incomplete zero', () => {
            const renderResult = render(<OutcomeIconSet pass={3} incomplete={0} fail={4} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([OutcomeIcon]);
        });

        test('render all zero', () => {
            const renderResult = render(<OutcomeIconSet pass={0} incomplete={0} fail={0} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([OutcomeIcon]);
        });
    });
});
