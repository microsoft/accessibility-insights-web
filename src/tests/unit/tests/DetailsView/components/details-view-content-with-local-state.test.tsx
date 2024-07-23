// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { act, render } from '@testing-library/react';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewContentProps } from 'DetailsView/components/details-view-content';
import {
    DetailsViewContentWithLocalState,
    DetailsViewContentWithLocalStateProps,
} from 'DetailsView/components/details-view-content-with-local-state';
import {
    NarrowModeDetector,
    NarrowModeDetectorProps,
} from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/narrow-mode-detector');
describe(DetailsViewContentWithLocalState, () => {
    mockReactComponents([NarrowModeDetector]);

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
        const renderResult = render(<DetailsViewContentWithLocalState {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
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

            render(<DetailsViewContentWithLocalState {...props} />);

            const detector = getMockComponentClassPropsForCall(NarrowModeDetector);
            expect(detector.childrenProps.isSideNavOpen).toBe(false);

            act(() => callSetNavOpen(detector, true, eventStub));
            const detectorCall2 = getMockComponentClassPropsForCall(NarrowModeDetector, 2);
            expect(detectorCall2.childrenProps.isSideNavOpen).toBe(true);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        test('nav closed and no telemetry sent', () => {
            detailsViewActionMessageCreatorMock
                .setup(d => d.leftNavPanelExpanded(It.isAny()))
                .verifiable(Times.once());

            render(<DetailsViewContentWithLocalState {...props} />);
            const narrowProps = getMockComponentClassPropsForCall(NarrowModeDetector);
            act(() => callSetNavOpen(narrowProps, true));

            const narrowProps2 = getMockComponentClassPropsForCall(NarrowModeDetector, 2);
            expect(narrowProps2.childrenProps.isSideNavOpen).toBe(true);

            act(() => callSetNavOpen(narrowProps2, false));

            const narrowProps3 = getMockComponentClassPropsForCall(NarrowModeDetector, 3);
            expect(narrowProps3.childrenProps.isSideNavOpen).toBe(false);

            detailsViewActionMessageCreatorMock.verifyAll();
        });

        function callSetNavOpen(
            wrapper: any,
            isOpen: boolean,
            event?: React.MouseEvent<any>,
        ): void {
            const setNavOpen = (wrapper as NarrowModeDetectorProps<DetailsViewContentProps>)
                .childrenProps.setSideNavOpen;
            setNavOpen(isOpen, event);
        }
    });
});
