// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ReportHeadV2 } from '../../../../../../DetailsView/reports/components/report-head-v2';

describe('ReportHeadV2', () => {
    it('renders', () => {
        const wrapper = shallow(<ReportHeadV2 />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
