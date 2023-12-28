// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    AssessmentLeftNavHamburgerButton,
    FastPassLeftNavHamburgerButton,
    QuickAssessLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import * as React from 'react';

describe('AssessmentLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const renderResult = render(
            <AssessmentLeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                className={'some-class'}
            />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('QuickAssessLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const renderResult = render(
            <QuickAssessLeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                className={'some-class'}
            />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('FastPassLeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const renderResult = render(
            <FastPassLeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                className={'some-class'}
            />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
