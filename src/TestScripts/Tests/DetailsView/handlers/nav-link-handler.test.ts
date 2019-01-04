// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.`
import { Mock, MockBehavior } from 'typemoq';

import { VisualizationType } from '../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import { NavLinkForLeftNav } from '../../../../DetailsView/components/details-view-left-nav';
import { NavLinkHandler } from '../../../../DetailsView/components/left-nav/nav-link-handler';

describe('NavLinkHandler', () => {
    describe('onAssessmentTestClick', () => {
        it('should call selectDetailsView and changeRightContentPanel with appropriate params', () => {
            const actionMessageCreator = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
            const testSubject = new NavLinkHandler(actionMessageCreator.object);
            const eventStub = {} as React.MouseEvent<HTMLElement>;
            const link = {
                key: 'test',
            } as NavLinkForLeftNav;
            const selectedPivot = -1;

            actionMessageCreator
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], selectedPivot))
                .verifiable();

            actionMessageCreator
                .setup(amc => amc.changeRightContentPanel('TestView'))
                .verifiable();

            testSubject.onAssessmentTestClick(eventStub, link, selectedPivot);
            actionMessageCreator.verifyAll();
        });
    });

    describe('onTestClick', () => {
        it('should call selectDetailsView with appropriate params', () => {
            const actionMessageCreator = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
            const testSubject = new NavLinkHandler(actionMessageCreator.object);
            const eventStub = {} as React.MouseEvent<HTMLElement>;
            const link = {
                key: 'test',
            } as NavLinkForLeftNav;
            const selectedPivot = -1;

            actionMessageCreator
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], selectedPivot))
                .verifiable();

            testSubject.onTestClick(eventStub, link, selectedPivot);
            actionMessageCreator.verifyAll();
        });
    });

    describe('onOverviewClick', () => {
        it('should call changeRightContentPanel with appropriate params', () => {
            const actionMessageCreator = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
            const testSubject = new NavLinkHandler(actionMessageCreator.object);

            actionMessageCreator
                .setup(amc => amc.changeRightContentPanel('Overview'))
                .verifiable();

            testSubject.onOverviewClick();
            actionMessageCreator.verifyAll();

        });
    });
});
