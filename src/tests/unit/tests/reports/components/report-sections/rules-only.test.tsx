// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import { RulesOnly, RulesOnlyDeps } from 'reports/components/report-sections/rules-only';
import { FullRuleHeader } from '../../../../../../reports/components/report-sections/full-rule-header';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/full-rule-header');
describe('RulesOnly', () => {
    mockReactComponents([FullRuleHeader]);
    const depsStub = {} as RulesOnlyDeps;

    it('renders', () => {
        const cardResults = [
            { id: '1' } as CardRuleResult,
            { id: '2' } as CardRuleResult,
            { id: '3' } as CardRuleResult,
        ];

        const renderResult = render(
            <RulesOnly deps={depsStub} outcomeType={'pass'} cardRuleResults={cardResults} />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([FullRuleHeader]);
    });
});
