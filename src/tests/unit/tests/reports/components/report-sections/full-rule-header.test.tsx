// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import {
    FullRuleHeader,
    FullRuleHeaderDeps,
    FullRuleHeaderProps,
} from 'reports/components/report-sections/full-rule-header';
import { GuidanceLinks } from '../../../../../../common/components/guidance-links';
import { GuidanceTags } from '../../../../../../common/components/guidance-tags';
import { NewTabLink } from '../../../../../../common/components/new-tab-link';
import { OutcomeChip } from '../../../../../../reports/components/outcome-chip';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/outcome-chip');
jest.mock('../../../../../../common/components/guidance-links');
jest.mock('../../../../../../common/components/guidance-tags');
jest.mock('../../../../../../common/components/new-tab-link');
describe('FullRuleHeader', () => {
    mockReactComponents([OutcomeChip, GuidanceLinks, GuidanceTags, NewTabLink]);

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

        const renderResult = render(<FullRuleHeader {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('guidance links and the containing parenthesis are not rendered without guidance', () => {
        rule.guidance = null;
        const props: FullRuleHeaderProps = {
            deps: depsStub,
            cardRuleResult: rule,
            outcomeType: 'fail',
        };

        const renderResult = render(<FullRuleHeader {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('ruleId is displayed as text when there is no url provided for a link', () => {
        rule.url = null;
        const props: FullRuleHeaderProps = {
            deps: depsStub,
            cardRuleResult: rule,
            outcomeType: 'fail',
        };

        const renderResult = render(<FullRuleHeader {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
