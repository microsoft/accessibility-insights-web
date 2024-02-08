// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { OutcomeChipSet } from 'reports/components/outcome-chip-set';
import { OutcomeChip } from '../../../../../reports/components/outcome-chip';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../reports/components/outcome-chip');

describe('OutcomeChipSet', () => {
    mockReactComponents([OutcomeChip]);
    describe('render', () => {
        test('render with all properties', () => {
            const renderResult = render(<OutcomeChipSet pass={3} incomplete={2} fail={4} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        test('render incomplete zero', () => {
            const renderResult = render(<OutcomeChipSet pass={3} incomplete={0} fail={4} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        test('render all zero', () => {
            const renderResult = render(<OutcomeChipSet pass={0} incomplete={0} fail={0} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
