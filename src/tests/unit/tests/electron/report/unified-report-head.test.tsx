// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedReportHead } from 'electron/views/report/unified-report-head';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('UnifiedReportHead', () => {
    it('renders', () => {
        const wrapper = shallow(<UnifiedReportHead />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
