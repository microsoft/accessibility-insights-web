// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    AssessmentLeftNavHamburgerButton,
    FastPassLeftNavHamburgerButton,
    QuickAssessLeftNavHamburgerButton,
} from 'common/components/expand-collapse-left-nav-hamburger-button';
import * as React from 'react';
import { LeftNavHamburgerButton } from '../../../../../common/components/left-nav-hamburger-button';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../common/components/left-nav-hamburger-button');
describe('AssessmentLeftNavHamburgerButton', () => {
    mockReactComponents([LeftNavHamburgerButton]);
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
