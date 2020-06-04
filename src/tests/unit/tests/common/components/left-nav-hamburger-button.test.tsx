// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentLeftNavHamburgerButton,
    FastPassLeftNavHamburgerButton,
} from 'common/components/left-nav-hamburger-button';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('LeftNavHamburgerButton', () => {
    it('renders per snapshot for Assessment', () => {
        const wrapper = shallow(<AssessmentLeftNavHamburgerButton isLeftNavOpen={false} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot for FastPass', () => {
        const wrapper = shallow(<FastPassLeftNavHamburgerButton isLeftNavOpen={false} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
