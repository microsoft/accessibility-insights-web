// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { FooterSection } from 'reports/components/report-sections/footer-section';

describe('FooterSection', () => {
    it('renders', () => {
        const wrapper = shallow(<FooterSection />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
