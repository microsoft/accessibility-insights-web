// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { RuleDetail } from '../../../../../../../DetailsView/reports/components/report-sections/rule-detail';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RuleDetailsGroup', () => {
    it('renders, not a header', () => {
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

        const children = <span>children</span>;

        const wrapped = shallow(
            <RuleDetail rule={rule} isHeader={false}>
                {children}
            </RuleDetail>,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('renders, it is header', () => {
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

        const children = <span>children</span>;

        const wrapped = shallow(
            <RuleDetail rule={rule} isHeader={true}>
                {children}
            </RuleDetail>,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
