// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import {
    PassedChecksSection,
    PassedChecksSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/passed-checks-section';
import { RuleResult } from 'scanner/iruleresults';

describe('PassedChecksSection', () => {
    it('renders', () => {
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];
        const props: PassedChecksSectionProps = {
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
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
