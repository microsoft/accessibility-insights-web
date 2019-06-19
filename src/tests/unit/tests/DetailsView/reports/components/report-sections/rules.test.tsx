// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RuleDetailsGroupDeps } from '../../../../../../../DetailsView/reports/components/report-sections/rule-details-group';
import { Rules } from '../../../../../../../DetailsView/reports/components/report-sections/rules';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('Rules', () => {
    const depsStub = {} as RuleDetailsGroupDeps;

    it('renders', () => {
        const rules = [{ id: '1' } as RuleResult, { id: '2' } as RuleResult, { id: '3' } as RuleResult];

        const wrapped = shallow(<Rules deps={depsStub} outcomeType={'pass'} rules={rules} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
