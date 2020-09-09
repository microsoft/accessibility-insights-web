// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { SummaryReportHeaderSection } from 'reports/components/report-sections/summary-report-header-section';

describe('SummaryReportHeaderSection', () => {
    it('renders', () => {
        const wrapper = shallow(<SummaryReportHeaderSection />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
