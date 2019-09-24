// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    NotApplicableChecksSection,
    NotApplicableChecksSectionProps,
} from 'reports/components/report-sections/not-applicable-checks-section';
import { RuleResult } from 'scanner/iruleresults';

import { SectionDeps } from '../../../../../../reports/components/report-sections/report-section-factory';

describe('NotApplicableChecksSection', () => {
    it('renders', () => {
        const props: NotApplicableChecksSectionProps = {
            deps: {} as SectionDeps,
            scanResult: {
                inapplicable: [{} as RuleResult, {} as RuleResult, {} as RuleResult],
                violations: [],
                passes: [],
                incomplete: [],
                timestamp: 'today',
                targetPageTitle: 'page title',
                targetPageUrl: 'url://page.url',
            },
        };

        const wrapper = shallow(<NotApplicableChecksSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
