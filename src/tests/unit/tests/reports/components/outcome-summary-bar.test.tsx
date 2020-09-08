// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { OutcomeSummaryBar, OutcomeSummaryBarProps } from 'reports/components/outcome-summary-bar';
import { OutcomeType } from 'reports/components/outcome-type';

describe('OutcomeSummaryBar', () => {
    const allOutcomeTypes: OutcomeType[] = ['pass', 'fail', 'incomplete'];
    const outcomeStats = {
        pass: 42,
        incomplete: 7,
        fail: 13,
    };

    it('show by percentage', () => {
        const props: OutcomeSummaryBarProps = { outcomeStats, allOutcomeTypes, countSuffix: '%' };
        const wrapper = shallow(<OutcomeSummaryBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('show by count', () => {
        const props: OutcomeSummaryBarProps = { outcomeStats, allOutcomeTypes };
        const wrapper = shallow(<OutcomeSummaryBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('render inverted badges', () => {
        const props: OutcomeSummaryBarProps = {
            outcomeStats,
            allOutcomeTypes,
            iconStyleInverted: true,
        };
        const wrapper = shallow(<OutcomeSummaryBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('show with text label', () => {
        const props: OutcomeSummaryBarProps = { outcomeStats, allOutcomeTypes, textLabel: true };
        const wrapper = shallow(<OutcomeSummaryBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
