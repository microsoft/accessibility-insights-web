// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    RuleDetailsGroup,
    RuleDetailsGroupDeps,
} from '../../../../../../../DetailsView/reports/components/report-sections/rule-details-group';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RuleDetailsGroup', () => {
    const depsStub = {} as RuleDetailsGroupDeps;

    it('renders, no details', () => {
        const rules = [{ id: '1' } as RuleResult, { id: '2' } as RuleResult, { id: '3' } as RuleResult];

        const wrapped = shallow(<RuleDetailsGroup deps={depsStub} outcomeType={'pass'} rules={rules} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('renders, with details', () => {
        const rules = [
            {
                id: '1',
                nodes: [
                    {
                        html: '<html>',
                        snippet: '<html>',
                        failureSummary: 'fix the error on html tag',
                    } as AxeNodeResult,
                ],
            } as RuleResult,
        ];

        const wrapped = shallow(<RuleDetailsGroup deps={depsStub} outcomeType={'pass'} rules={rules} showDetails={true} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
