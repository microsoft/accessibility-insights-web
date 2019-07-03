// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    RuleDetail,
    RuleDetailDeps,
    RuleDetailProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/full-rule-detail';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RuleDetail', () => {
    const depsStub = {} as RuleDetailDeps;
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

    const props: RuleDetailProps = {
        deps: depsStub,
        rule: rule,
        outcomeType: 'fail',
    };

    it('renders', () => {
        const wrapped = shallow(<RuleDetail {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
