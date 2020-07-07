// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    LeftNavHamburgerButton,
    LeftNavHamburgerButtonProps,
} from 'common/components/left-nav-hamburger-button';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { shallow } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('LeftNavHamburgerButton', () => {
    const ariaLabel: string = 'test-aria-label';
    const eventStub = {} as React.MouseEvent;

    let setSideNavOpenMock: IMock<(isOpen: boolean) => void>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        setSideNavOpenMock = Mock.ofInstance((isOpen: boolean) => {});
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
    });

    it('renders per snapshot', () => {
        const wrapper = shallow(
            <LeftNavHamburgerButton
                isSideNavOpen={false}
                setSideNavOpen={null}
                ariaLabel={ariaLabel}
                deps={{
                    detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                }}
            />,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test.each([true, false])(
        'sets side nav state to correct value when isSideNavOpen=%o',
        isSideNavOpen => {
            setSideNavOpenMock.setup(sm => sm(!isSideNavOpen)).verifiable(Times.once());
            const props = getProps(isSideNavOpen);

            testButtonClick(props);

            setSideNavOpenMock.verifyAll();
        },
    );

    it('sends telemetry when opening side nav', () => {
        const isSideNavOpen = false;
        detailsViewActionMessageCreatorMock
            .setup(d => d.leftNavPanelExpanded(eventStub))
            .verifiable(Times.once());
        const props = getProps(isSideNavOpen);

        testButtonClick(props);

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('does not send telemetry when closing side nav', () => {
        const isSideNavOpen = true;
        detailsViewActionMessageCreatorMock
            .setup(d => d.leftNavPanelExpanded(eventStub))
            .verifiable(Times.never());
        const props = getProps(isSideNavOpen);

        testButtonClick(props);

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    function getProps(isSideNavOpen: boolean): LeftNavHamburgerButtonProps {
        return {
            ariaLabel,
            isSideNavOpen,
            setSideNavOpen: setSideNavOpenMock.object,
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
        } as LeftNavHamburgerButtonProps;
    }

    function testButtonClick(props: LeftNavHamburgerButtonProps): void {
        const wrapper = shallow(<LeftNavHamburgerButton {...props} />);
        const button = wrapper.find(IconButton);
        button.simulate('click', eventStub);
    }
});
