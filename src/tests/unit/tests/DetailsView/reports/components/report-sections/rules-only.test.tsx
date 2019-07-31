// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';
import { RulesOnly, RulesOnlyDeps } from 'reports/components/report-sections/rules-only';

describe('RulesOnly', () => {
    const depsStub = {} as RulesOnlyDeps;

    it('renders', () => {
        const rules = [{ id: '1' } as RuleResult, { id: '2' } as RuleResult, { id: '3' } as RuleResult];

        const wrapped = shallow(<RulesOnly deps={depsStub} outcomeType={'pass'} rules={rules} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
