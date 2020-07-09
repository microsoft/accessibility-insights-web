// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    LeftNavHamburgerButton,
    LeftNavHamburgerButtonProps,
} from 'common/components/left-nav-hamburger-button';
import { shallow } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('LeftNavHamburgerButton', () => {
    it('renders per snapshot', () => {
        const ariaLabel: string = 'test-aria-label';
        const wrapper = shallow(
            <LeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                ariaLabel={ariaLabel}
            />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('sets side nav state with correct value', () => {
        const ariaLabel: string = 'test-aria-label';
        const eventStub = {} as React.MouseEvent<any>;
        const setSideNavOpenMock = Mock.ofInstance(
            (isOpen: boolean, event: React.MouseEvent<any>) => {},
        );
        const isSideNavOpen = false;
        setSideNavOpenMock.setup(sm => sm(!isSideNavOpen, eventStub)).verifiable(Times.once());
        const props: LeftNavHamburgerButtonProps = {
            ariaLabel,
            isSideNavOpen,
            setSideNavOpen: setSideNavOpenMock.object,
        } as LeftNavHamburgerButtonProps;

        const wrapper = shallow(<LeftNavHamburgerButton {...props} />);

        const button = wrapper.find(IconButton);
        button.simulate('click', eventStub);

        setSideNavOpenMock.verifyAll();
    });
});
