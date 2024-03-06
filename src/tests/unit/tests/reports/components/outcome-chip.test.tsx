// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { OutcomeIcon } from 'reports/components/outcome-icon';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('reports/components/outcome-icon');

describe('OutcomeChip', () => {
    mockReactComponents([OutcomeIcon]);
    describe('render', () => {
        test('pass', () => {
            const renderResult = render(<OutcomeChip outcomeType="pass" count={3} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
        test('incomplete', () => {
            const renderResult = render(<OutcomeChip outcomeType="incomplete" count={2} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
        test('fail', () => {
            const renderResult = render(<OutcomeChip outcomeType="fail" count={4} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        test('inapplicable', () => {
            const renderResult = render(<OutcomeChip outcomeType="inapplicable" count={4} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
