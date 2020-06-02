// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    LeftNavHamburgerButton,
    LeftNavHamburgerButtonProps,
} from 'common/components/left-nav-hamburger-button';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';

describe('LeftNavHamburgerButton', () => {
    it('renders per snapshot for FastPass', () => {
        const props: LeftNavHamburgerButtonProps = {
            selectedPivot: DetailsViewPivotType.fastPass,
            setSideNavOpen: () => {},
        };

        const wrapper = shallow(<LeftNavHamburgerButton {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot for Assessment', () => {
        const props: LeftNavHamburgerButtonProps = {
            selectedPivot: DetailsViewPivotType.assessment,
            setSideNavOpen: () => {},
        };

        const wrapper = shallow(<LeftNavHamburgerButton {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
