// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RulesOnly } from '../../../../../../../DetailsView/reports/components/report-sections/rules';
import { RulesWithInstancesDeps } from '../../../../../../../DetailsView/reports/components/report-sections/rules-with-instances';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('Rules', () => {
    const depsStub = {} as RulesWithInstancesDeps;

    it('renders', () => {
        const rules = [{ id: '1' } as RuleResult, { id: '2' } as RuleResult, { id: '3' } as RuleResult];

        const wrapped = shallow(<RulesOnly deps={depsStub} outcomeType={'pass'} rules={rules} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
