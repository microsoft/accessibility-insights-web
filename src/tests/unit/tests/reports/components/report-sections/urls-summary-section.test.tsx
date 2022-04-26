// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    UrlsSummarySection,
    UrlsSummarySectionProps,
} from 'reports/components/report-sections/urls-summary-section';

describe(UrlsSummarySection.displayName, () => {
    const props: UrlsSummarySectionProps = {
        passedUrlsCount: 1,
        failedUrlsCount: 2,
        notScannedUrlsCount: 3,
        failureInstancesCount: 10,
    };

    it('renders', () => {
        const wrapper = shallow(<UrlsSummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
