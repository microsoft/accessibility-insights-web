// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { PassedChecksSection, PassedChecksSectionProps } from 'reports/components/report-sections/passed-checks-section';
import { RuleResult } from 'scanner/iruleresults';

import { SectionDeps } from '../../../../../../reports/components/report-sections/report-section-factory';

describe('PassedChecksSection', () => {
    it('renders', () => {
        const props: PassedChecksSectionProps = {
            deps: {} as SectionDeps,
            scanResult: {
                passes: [{} as RuleResult, {} as RuleResult, {} as RuleResult],
                violations: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 'today',
                targetPageTitle: 'page title',
                targetPageUrl: 'url://page.url',
            },
        };

        const wrapper = shallow(<PassedChecksSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
