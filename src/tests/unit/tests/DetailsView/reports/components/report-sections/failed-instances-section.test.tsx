// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    FailedInstancesSection,
    FailedInstancesSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/failed-instances-section';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('FailedInstancesSection', () => {
    it('renders', () => {
        const props: FailedInstancesSectionProps = {
            scanResult: {
                violations: [{} as RuleResult, {} as RuleResult, {} as RuleResult],
                passes: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 'today',
                targetPageTitle: 'page title',
                targetPageUrl: 'url://page.url',
            },
        };

        const wrapper = shallow(<FailedInstancesSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
