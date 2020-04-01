// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import { RulesOnly, RulesOnlyDeps } from 'reports/components/report-sections/rules-only';

describe('RulesOnly', () => {
    const depsStub = {} as RulesOnlyDeps;

    it('renders', () => {
        const cardResults = [
            { id: '1' } as CardRuleResult,
            { id: '2' } as CardRuleResult,
            { id: '3' } as CardRuleResult,
        ];

        const wrapped = shallow(
            <RulesOnly deps={depsStub} outcomeType={'pass'} cardRuleResults={cardResults} />,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
