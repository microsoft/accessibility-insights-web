// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { OutcomeSummaryBar } from '../../../../../DetailsView/reports/components/outcome-summary-bar';
import { shallow } from 'enzyme';

describe('OutcomeSummaryBar', () => {

    const reportData = {
        pass: 42,
        incomplete: 7,
        fail: 13,
    };

    it('renders with defaults', () => {
        expect(shallow(<OutcomeSummaryBar {...reportData} />).debug()).toMatchSnapshot();
    });

    it('renders reporting requirements', () => {
        expect(shallow(<OutcomeSummaryBar {...reportData} units="requirements" />).debug()).toMatchSnapshot();
    });

    it('renders reporting percentage', () => {
        expect(shallow(<OutcomeSummaryBar {...reportData} units="percentage" />).debug()).toMatchSnapshot();
    });
});
