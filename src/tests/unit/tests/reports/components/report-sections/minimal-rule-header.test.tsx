// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { RuleResourcesDeps } from 'common/components/cards/rule-resources';
import { GuidanceTags } from 'common/components/guidance-tags';
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
jest.mock('../../../../../../common/components/guidance-tags');
describe('MinimalRuleHeader', () => {
    mockReactComponents([OutcomeChip, GuidanceTags]);
    const rule = {
        id: 'rule id',
        description: 'rule description',
        nodes: [{}],
    };
    const outcomeCounterStub: OutcomeCounter = _ => 2;
    const depsStub = {} as RuleResourcesDeps;

    it.each(allInstanceOutcomeTypes)('renders, outcomeType = %s', outcomeType => {
        const props: MinimalRuleHeaderProps = {
            deps: depsStub,
            rule,
            outcomeType,
            outcomeCounter: outcomeCounterStub,
        };

        const renderResult = render(<MinimalRuleHeader {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
