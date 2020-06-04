// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    getAssessmentLeftNavHamburgerButton,
    getFastPassLeftNavHamburgerButton,
} from 'common/components/left-nav-hamburger-button';
import { shallow } from 'enzyme';

describe('LeftNavHamburgerButton', () => {
    it('renders per snapshot for Assessment', () => {
        const wrapper = shallow(getAssessmentLeftNavHamburgerButton());

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders per snapshot for FastPass', () => {
        const wrapper = shallow(getFastPassLeftNavHamburgerButton());

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
