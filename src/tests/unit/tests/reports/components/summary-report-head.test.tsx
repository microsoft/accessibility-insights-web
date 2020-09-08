// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { SummaryReportHead } from 'reports/components/summary-report-head';

describe('SummaryReportHead', () => {
    it('renders', () => {
        const wrapper = shallow(<SummaryReportHead />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
