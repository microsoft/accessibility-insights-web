// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentLeftNavHamburgerButton,
    FastPassLeftNavHamburgerButton,
    QuickAssessLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AssessmentLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const wrapper = shallow(
            <AssessmentLeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                className={'some-class'}
            />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('QuickAssessLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const wrapper = shallow(
            <QuickAssessLeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                className={'some-class'}
            />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('FastPassLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const wrapper = shallow(
            <FastPassLeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                className={'some-class'}
            />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
