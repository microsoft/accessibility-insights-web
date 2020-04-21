// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { HeaderSection } from 'reports/components/report-sections/header-section';

describe('HeaderSection', () => {
    it('renders', () => {
        const targetAppInfo = {
            name: 'page-title',
            url: 'url://page',
        };
        const wrapper = shallow(<HeaderSection targetAppInfo={targetAppInfo} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
