// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import {
    NotApplicableChecksSection,
    NotApplicableChecksSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/not-applicable-checks-section';
import { RuleResult } from 'scanner/iruleresults';

describe('NotApplicableChecksSection', () => {
    it('renders', () => {
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];
        const props: NotApplicableChecksSectionProps = {
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
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
