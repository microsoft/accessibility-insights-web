// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { OutcomeChip } from 'reports/components/outcome-chip';

describe('OutcomeChip', () => {
    describe('render', () => {
        test('pass', () => {
            const wrapper = shallow(
                <OutcomeChip outcomeType="pass" count={3} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('incomplete', () => {
            const wrapper = shallow(
                <OutcomeChip outcomeType="incomplete" count={2} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('fail', () => {
            const wrapper = shallow(
                <OutcomeChip outcomeType="fail" count={4} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('inapplicable', () => {
            const wrapper = shallow(
                <OutcomeChip outcomeType="inapplicable" count={4} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
