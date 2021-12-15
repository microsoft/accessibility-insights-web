// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { FastPassOutcomeSummaryBar } from 'reports/components/fast-pass-outcome-summary-bar';

describe('FastPassOutcomeSummaryBar', () => {
    it('renders per the snapshot', () => {
        const rendered = shallow(<FastPassOutcomeSummaryBar />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
