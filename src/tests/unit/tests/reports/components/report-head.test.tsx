// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportHead } from 'reports/components/report-head';

describe('ReportHead', () => {
    it('renders', () => {
        const wrapper = shallow(<ReportHead />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
