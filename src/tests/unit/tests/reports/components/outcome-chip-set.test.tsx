// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { OutcomeChipSet } from 'reports/components/outcome-chip-set';

describe('OutcomeChipSet', () => {
    describe('render', () => {
        test('render with all properties', () => {
            const wrapper = shallow(
                <OutcomeChipSet pass={3} incomplete={2} fail={4} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('render incomplete zero', () => {
            const wrapper = shallow(
                <OutcomeChipSet pass={3} incomplete={0} fail={4} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        test('render all zero', () => {
            const wrapper = shallow(
                <OutcomeChipSet pass={0} incomplete={0} fail={0} />,
            );
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
