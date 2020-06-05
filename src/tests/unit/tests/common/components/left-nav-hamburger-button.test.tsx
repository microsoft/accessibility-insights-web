// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LeftNavHamburgerButton } from 'common/components/left-nav-hamburger-button';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('LeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const ariaLabel: string = 'test-aria-label';
        const wrapper = shallow(<LeftNavHamburgerButton ariaLabel={ariaLabel} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
