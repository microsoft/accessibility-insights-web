// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    LeftNavHamburgerButton,
    LeftNavHamburgerButtonDeps,
} from 'common/components/left-nav-hamburger-button';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('LeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const deps: LeftNavHamburgerButtonDeps = {
            ariaLabel: 'test-aria-label',
        };

        const wrapper = shallow(<LeftNavHamburgerButton deps={deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
