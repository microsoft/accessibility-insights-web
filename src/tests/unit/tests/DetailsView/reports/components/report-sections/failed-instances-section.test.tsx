// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { GetGuidanceTagsFromGuidanceLinks } from '../../../../../../../common/get-guidance-tags-from-guidance-links';
import {
    FailedInstancesSection,
    FailedInstancesSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/failed-instances-section';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('FailedInstancesSection', () => {
    it('renders', () => {
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];

        const props: FailedInstancesSectionProps = {
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            scanResult: {
                violations: [{ nodes: [{}, {}] } as RuleResult, { nodes: [{}] } as RuleResult, { nodes: [{}, {}, {}] } as RuleResult],
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
