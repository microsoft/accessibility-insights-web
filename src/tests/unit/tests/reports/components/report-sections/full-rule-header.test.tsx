// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import { FullRuleHeader, FullRuleHeaderDeps, FullRuleHeaderProps } from 'reports/components/report-sections/full-rule-header';
import { RuleResult } from 'scanner/iruleresults';

describe('FullRuleHeader', () => {
    const depsStub = {} as FullRuleHeaderDeps;
    const rule = {
        helpUrl: 'url://help.url',
        id: 'rule id',
        description: 'rule description',
        guidanceLinks: [
            {
                href: 'url://guidance-01.link',
                text: 'guidance-01',
            },
            {
                href: 'url://guidance-02.link',
                text: 'guidance-02',
            },
        ],
        nodes: [{} as AxeNodeResult],
    } as RuleResult;

    it.each(allInstanceOutcomeTypes)('renders, outcomeType = %s', outcomeType => {
        const props: FullRuleHeaderProps = {
            deps: depsStub,
            rule: rule,
            outcomeType,
        };

        const wrapped = shallow(<FullRuleHeader {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
