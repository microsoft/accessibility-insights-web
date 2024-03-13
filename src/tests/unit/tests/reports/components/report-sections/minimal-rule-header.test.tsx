// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import { OutcomeCounter } from 'reports/components/outcome-counter';
import {
    MinimalRuleHeader,
    MinimalRuleHeaderProps,
} from 'reports/components/report-sections/minimal-rule-header';
import { OutcomeChip } from '../../../../../../reports/components/outcome-chip';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/outcome-chip');
describe('MinimalRuleHeader', () => {
    mockReactComponents([OutcomeChip]);
    const rule = {
        id: 'rule id',
        description: 'rule description',
        nodes: [{}],
    };
    const outcomeCounterStub: OutcomeCounter = _ => 2;

    it.each(allInstanceOutcomeTypes)('renders, outcomeType = %s', outcomeType => {
        const props: MinimalRuleHeaderProps = {
            rule,
            outcomeType,
            outcomeCounter: outcomeCounterStub,
        };

        const renderResult = render(<MinimalRuleHeader {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
