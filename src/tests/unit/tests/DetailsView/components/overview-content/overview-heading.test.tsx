// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { OverviewHeading } from '../../../../../../DetailsView/components/overview-content/overview-heading';

describe('OverviewHeading', () => {
    test('overview-heading content is defined', () => {
        expect(<OverviewHeading />).toBeDefined();
    });

    test('overview heading has proper classname', () => {
        const wrapper = shallow(<OverviewHeading />);
        const overviewHeadingDiv = wrapper.find('.overview-heading');
        expect(overviewHeadingDiv.exists()).toBe(true);
    });

    test('overview heading has h1 heading and it contains proper text', () => {
        const wrapper = shallow(<OverviewHeading />);

        const h1Element = wrapper.find('h1');
        expect(h1Element.exists()).toBe(true);
        expect(h1Element.text()).toBe('Overview');
    });

    test('match snapshot', () => {
        const wrapper = shallow(<OverviewHeading />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
