// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeaderSection } from 'electron/views/automated-checks/components/header-section';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('HeaderSection', () => {
    it('renders', () => {
        const wrapper = shallow(<HeaderSection />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
