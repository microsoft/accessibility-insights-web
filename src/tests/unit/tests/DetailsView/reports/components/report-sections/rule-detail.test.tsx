// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RuleDetail } from '../../../../../../../DetailsView/reports/components/report-sections/rule-detail';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RuleDetailsGroup', () => {
    it('renders', () => {
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
        } as RuleResult;

        const wrapped = shallow(<RuleDetail rule={rule} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
