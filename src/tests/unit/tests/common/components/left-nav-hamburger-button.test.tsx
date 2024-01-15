// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createEvent, fireEvent, render } from '@testing-library/react';
import {
    LeftNavHamburgerButton,
    LeftNavHamburgerButtonProps,
} from 'common/components/left-nav-hamburger-button';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';
import { mockReactComponents, useOriginalReactElements } from '../../../mock-helpers/mock-module-helpers';
import { IconButton } from '@fluentui/react';
jest.mock('@fluentui/react');

describe('LeftNavHamburgerButton', () => {
    mockReactComponents([IconButton]);
    it('renders per snapshot', () => {
        const ariaLabel: string = 'test-aria-label';
        const renderResult = render(
            <LeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                ariaLabel={ariaLabel}
                className={'some-class'}
            />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('sets side nav state with correct value', async () => {
        useOriginalReactElements('@fluentui/react', ['IconButton']);
        const ariaLabel: string = 'test-aria-label';
        const setSideNavOpenMock = Mock.ofInstance(
            (isOpen: boolean, event: React.MouseEvent<any>) => {},
        );
        const isSideNavOpen = false;
        setSideNavOpenMock.setup(sm => sm(!isSideNavOpen, It.isAny())).verifiable(Times.once());
        const props: LeftNavHamburgerButtonProps = {
            ariaLabel,
            isSideNavOpen,
            setSideNavOpen: setSideNavOpenMock.object,
        } as LeftNavHamburgerButtonProps;

        const renderResult = render(<LeftNavHamburgerButton {...props} />);
        const button = renderResult.getByRole('button');

        const event = createEvent.click(button);
        fireEvent(button, event);

        setSideNavOpenMock.verifyAll();
    });
});
