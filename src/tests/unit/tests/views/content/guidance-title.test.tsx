// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { shallow } from 'enzyme';
import { productName } from '../../../../../content/strings/application';
import { GuidanceTitle } from '../../../../../views/content/guidance-title';

describe('guidance title', () => {
    test('has correct structure', () => {
        const wrapper = shallow(<GuidanceTitle name={'test'} />);
        expect(wrapper.find('title').text()).toEqual(`Guidance for test - ${productName}`);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
