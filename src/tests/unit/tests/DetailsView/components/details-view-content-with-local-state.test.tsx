// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewContentProps } from 'DetailsView/components/details-view-content';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateProps,
} from 'DetailsView/components/details-view-content-with-local-state';
import { NarrowModeDetectorProps } from 'DetailsView/components/narrow-mode-detector';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe(DetailsViewContentWithLocalState, () => {
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
    });

    test('render', () => {
        const props = {
            storeState: {
                featureFlagStoreData: {},
            } as any,
        } as DetailsViewContentWithLocalStateProps;
        const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    describe('nav state change', () => {
        let props: DetailsViewContentWithLocalStateProps;

        beforeEach(() => {
            props = {
                storeState: {
                    featureFlagStoreData: {},
                } as any,
                deps: {
                    detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                },
            } as DetailsViewContentWithLocalStateProps;
        });

        test('nav opened and telemetry sent', () => {
            const eventStub = {} as React.MouseEvent<any>;
            detailsViewActionMessageCreatorMock
                .setup(d => d.leftNavPanelExpanded(eventStub))
                .verifiable(Times.once());

            const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);

            expect(wrapper.state('isSideNavOpen')).toBe(false);

            callSetNavOpen(wrapper, true, eventStub);

            expect(wrapper.state('isSideNavOpen')).toBe(true);
            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('nav closed and no telemetry sent', () => {
            detailsViewActionMessageCreatorMock
                .setup(d => d.leftNavPanelExpanded(It.isAny()))
                .verifiable(Times.never());

            const wrapper = shallow(<DetailsViewContentWithLocalState {...props} />);
            wrapper.setState({ isSideNavOpen: true });

            expect(wrapper.state('isSideNavOpen')).toBe(true);

            callSetNavOpen(wrapper, false);

            expect(wrapper.state('isSideNavOpen')).toBe(false);
            detailsViewActionMessageCreatorMock.verifyAll();
        });

        function callSetNavOpen(
            wrapper: ShallowWrapper<any, {}>,
            isOpen: boolean,
            event?: React.MouseEvent<any>,
        ): void {
            const setNavOpen = (
                wrapper.childAt(0).props() as NarrowModeDetectorProps<DetailsViewContentProps>
            ).childrenProps.setSideNavOpen;
            setNavOpen(isOpen, event);
        }
    });
});
