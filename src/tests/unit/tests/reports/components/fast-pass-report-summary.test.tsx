// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { shallow } from 'enzyme';
import * as React from 'react';
import { FastPassReportSummary } from 'reports/components/fast-pass-report-summary';

describe('FastPassReportSummary', () => {
    it('renders per the snapshot', () => {
        const rendered = shallow(<FastPassReportSummary />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

});
