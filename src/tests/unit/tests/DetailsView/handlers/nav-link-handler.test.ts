// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.`
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { BaseLeftNavLink } from 'DetailsView/components/base-left-nav';
import {
    AssessmentLeftNavLink,
    TestGettingStartedNavLink,
    TestRequirementLeftNavLink,
} from 'DetailsView/components/left-nav/assessment-left-nav';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('NavLinkHandler', () => {
    const irrelevantVisualizationType = -1 as VisualizationType;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let testSubject: NavLinkHandler;
    let eventStub: React.MouseEvent<HTMLElement>;
    let link: BaseLeftNavLink;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
            MockBehavior.Strict,
        );
        testSubject = new NavLinkHandler(detailsViewActionMessageCreatorMock.object);
        eventStub = {} as React.MouseEvent<HTMLElement>;
        link = {
            key: 'test',
        } as BaseLeftNavLink;
    });

    describe('onOverviewClick', () => {
        it('should call changeRightContentPanel with appropriate params', () => {
            detailsViewActionMessageCreatorMock
                .setup(amc => amc.changeRightContentPanel('Overview'))
                .verifiable();

            testSubject.onOverviewClick();
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onFastPassTestClick', () => {
        it('should call selectDetailsView with appropriate params', () => {
            detailsViewActionMessageCreatorMock
                .setup(amc =>
                    amc.selectDetailsView(
                        eventStub,
                        VisualizationType[link.key],
                        DetailsViewPivotType.fastPass,
                    ),
                )
                .verifiable();

            testSubject.onFastPassTestClick(eventStub, link);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onAssessmentTestClick', () => {
        it('should call selectDetailsView and changeRightContentPanel with appropriate params', () => {
            detailsViewActionMessageCreatorMock
                .setup(amc =>
                    amc.selectDetailsView(
                        eventStub,
                        VisualizationType[link.key],
                        DetailsViewPivotType.assessment,
                    ),
                )
                .verifiable();

            detailsViewActionMessageCreatorMock
                .setup(amc => amc.changeRightContentPanel('TestView'))
                .verifiable();

            testSubject.onAssessmentTestClick(eventStub, link);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onRequirementClick', () => {
        it('should call selectRequirement and changeRightContentPanel with appropriate params', () => {
            const requirementLink = {
                requirementKey: 'some requirement',
                testType: irrelevantVisualizationType,
            } as TestRequirementLeftNavLink;
            detailsViewActionMessageCreatorMock
                .setup(amc =>
                    amc.selectRequirement(
                        eventStub,
                        requirementLink.requirementKey,
                        requirementLink.testType,
                    ),
                )
                .verifiable();

            detailsViewActionMessageCreatorMock
                .setup(amc => amc.changeRightContentPanel('TestView'))
                .verifiable();

            testSubject.onRequirementClick(eventStub, requirementLink);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onGettingStartedClick', () => {
        it('should call selectGettingStarted and changeRightContentPanel with appropriate params', () => {
            const gettingStartedLink = {
                testType: irrelevantVisualizationType,
            } as TestGettingStartedNavLink;
            detailsViewActionMessageCreatorMock
                .setup(amc => amc.selectGettingStarted(eventStub, gettingStartedLink.testType))
                .verifiable();

            detailsViewActionMessageCreatorMock
                .setup(amc => amc.changeRightContentPanel('TestView'))
                .verifiable();

            testSubject.onGettingStartedClick(eventStub, gettingStartedLink);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onTestHeadingClick with unexpanded link', () => {
        it('should call expandTestNav with appropriate params', () => {
            const testHeadingLink = {
                testType: irrelevantVisualizationType,
                isExpanded: false,
            } as AssessmentLeftNavLink;
            detailsViewActionMessageCreatorMock
                .setup(amc => amc.expandTestNav(testHeadingLink.testType))
                .verifiable();

            testSubject.onTestHeadingClick(eventStub, testHeadingLink);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('onTestHeadingClick with already expanded link', () => {
        it('should call expandTestNav with appropriate params', () => {
            const testHeadingLink = {
                testType: irrelevantVisualizationType,
                isExpanded: true,
            } as AssessmentLeftNavLink;
            detailsViewActionMessageCreatorMock.setup(amc => amc.collapseTestNav()).verifiable();

            testSubject.onTestHeadingClick(eventStub, testHeadingLink);
            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });
});
