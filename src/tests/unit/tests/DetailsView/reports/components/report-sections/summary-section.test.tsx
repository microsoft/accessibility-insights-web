// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { SummarySection, SummarySectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/summary-section';

describe('SummarySection', () => {
    const pageTitle = 'page-title';
    const pageUrl = 'url:target-page';

    const props: SummarySectionProps = {
        scanResult: {
            passes: [],
            violations: [],
            inapplicable: [],
            incomplete: [],
            timestamp: 'today',
            targetPageTitle: pageTitle,
            targetPageUrl: pageUrl,
        },
    };

    it('renders', () => {
        const wrapper = shallow(<SummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
