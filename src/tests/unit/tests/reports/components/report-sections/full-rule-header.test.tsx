// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import {
    FullRuleHeader,
    FullRuleHeaderDeps,
    FullRuleHeaderProps,
} from 'reports/components/report-sections/full-rule-header';

describe('FullRuleHeader', () => {
    let depsStub: FullRuleHeaderDeps;
    let rule: CardRuleResult;

    beforeEach(() => {
        depsStub = {} as FullRuleHeaderDeps;
        rule = {
            url: 'url://help.url',
            id: 'rule id',
            description: 'rule description',
            guidance: [
                {
                    href: 'url://guidance-01.link',
                    text: 'guidance-01',
                },
                {
                    href: 'url://guidance-02.link',
                    text: 'guidance-02',
                },
            ],
            nodes: [{}],
        } as CardRuleResult;
    });

    it.each(allInstanceOutcomeTypes)('renders, outcomeType = %s', outcomeType => {
        const props: FullRuleHeaderProps = {
            deps: depsStub,
            cardRuleResult: rule,
            outcomeType,
        };

        const wrapped = shallow(<FullRuleHeader {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('guidance links and the containing parenthesis are not rendered without guidance', () => {
        rule.guidance = null;
        const props: FullRuleHeaderProps = {
            deps: depsStub,
            cardRuleResult: rule,
            outcomeType: 'fail',
        };

        const wrapped = shallow(<FullRuleHeader {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('ruleId is displayed as text when there is no url provided for a link', () => {
        rule.url = null;
        const props: FullRuleHeaderProps = {
            deps: depsStub,
            cardRuleResult: rule,
            outcomeType: 'fail',
        };

        const wrapped = shallow(<FullRuleHeader {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
