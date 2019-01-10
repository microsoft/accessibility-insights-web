// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.`
import { IMock, Mock, MockBehavior } from 'typemoq';

import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { BaseLeftNavLink } from '../../../../../DetailsView/components/base-left-nav';
import { NavLinkHandler } from '../../../../../DetailsView/components/left-nav/nav-link-handler';

describe('NavLinkHandler', () => {
    let actionMessageCreator: IMock<DetailsViewActionMessageCreator>;
    let testSubject: NavLinkHandler;
    let eventStub: React.MouseEvent<HTMLElement>;
    let link: BaseLeftNavLink;

    beforeEach(() => {
        actionMessageCreator = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
        testSubject = new NavLinkHandler(actionMessageCreator.object);
        eventStub = {} as React.MouseEvent<HTMLElement>;
        link = {
            key: 'test',
        } as BaseLeftNavLink;
    });

    describe('onAssessmentTestClick', () => {
        it('should call selectDetailsView and changeRightContentPanel with appropriate params', () => {
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
            actionMessageCreator
                .setup(amc => amc.changeRightContentPanel('Overview'))
                .verifiable();

            testSubject.onOverviewClick();
            actionMessageCreator.verifyAll();

        });
    });

    describe('onFastPassTestClick', () => {
        it('should call selectDetailsView with appropriate params', () => {
            actionMessageCreator
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], DetailsViewPivotType.fastPass))
                .verifiable();

            testSubject.onFastPassTestClick(eventStub, link);
            actionMessageCreator.verifyAll();
        });
    });

    describe('onAllTestsTestClick', () => {
        it('should call selectDetailsView with appropriate params', () => {
            actionMessageCreator
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], DetailsViewPivotType.allTest))
                .verifiable();

            testSubject.onAllTestsTestClick(eventStub, link);
            actionMessageCreator.verifyAll();
        });
    });

    describe('onAssessmentTestClickV2', () => {
        it('should call selectDetailsView and changeRightContentPanel with appropriate params', () => {
            actionMessageCreator
                .setup(amc => amc.selectDetailsView(eventStub, VisualizationType[link.key], DetailsViewPivotType.assessment))
                .verifiable();

            actionMessageCreator
                .setup(amc => amc.changeRightContentPanel('TestView'))
                .verifiable();

            testSubject.onAssessmentTestClickV2(eventStub, link);
            actionMessageCreator.verifyAll();
        });
    });
});
