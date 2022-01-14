// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { TabStopsReportInstanceList } from 'reports/components/report-sections/tab-stops-report-instance-list';

describe('TabStopsReportInstanceList', () => {
    test('renders', () => {
        const props = {
            instances: [],
        };
        const wrapper = shallow(<TabStopsReportInstanceList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
