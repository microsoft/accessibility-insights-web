// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentLeftNavHamburgerButton,
    FastPassLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AssessmentLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const wrapper = shallow(<AssessmentLeftNavHamburgerButton isLeftNavOpen={false} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('FastPassLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const wrapper = shallow(<FastPassLeftNavHamburgerButton isLeftNavOpen={false} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
