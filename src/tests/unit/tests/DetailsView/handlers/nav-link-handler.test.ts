// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.`
import { IMock, Mock, MockBehavior } from 'typemoq';

import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { BaseLeftNavLink } from '../../../../../DetailsView/components/base-left-nav';
import { NavLinkHandler } from '../../../../../DetailsView/components/left-nav/nav-link-handler';

describe('NavLinkHandler', () => {
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let testSubject: NavLinkHandler;
    let eventStub: React.MouseEvent<HTMLElement>;
    let link: BaseLeftNavLink;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
        testSubject = new NavLinkHandler(detailsViewActionMessageCreatorMock.object);
        eventStub = {} as React.MouseEvent<HTMLElement>;
        link = {
            key: 'test',
        } as BaseLeftNavLink;
    });

    describe('onOverviewClick', () => {
        it('should call changeRightContentPanel with appropriate params', () => {
            detailsViewActionMessageCreatorMock.setup(amc => amc.changeRightContentPanel('Overview')).verifiable();

            testSubject.onOverviewClick();
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onFastPassTestClick', () => {
        it('should call selectDetailsView with appropriate params', () => {
            detailsViewActionMessageCreatorMock
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], DetailsViewPivotType.fastPass))
                .verifiable();

            testSubject.onFastPassTestClick(eventStub, link);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onAssessmentTestClick', () => {
        it('should call selectDetailsView and changeRightContentPanel with appropriate params', () => {
            detailsViewActionMessageCreatorMock
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], DetailsViewPivotType.assessment))
                .verifiable();

            detailsViewActionMessageCreatorMock.setup(amc => amc.changeRightContentPanel('TestView')).verifiable();

            testSubject.onAssessmentTestClick(eventStub, link);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });
});
