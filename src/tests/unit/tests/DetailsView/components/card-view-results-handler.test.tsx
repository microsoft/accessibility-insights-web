// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CardViewResultsHandler } from 'DetailsView/components/card-view-results-handler';
import { IMock, Mock, Times } from 'typemoq';

describe('CardViewResultsHandler', () => {
    let testSubject: CardViewResultsHandler;
    let callback: (issuesEnabled: boolean, cardCount: number) => void;
    const visualizationTypeStub = 1;

    beforeEach(() => {
        testSubject = new CardViewResultsHandler();
    });

    describe('fastPassHandleCardViewResults', () => {
        let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
        let visualizationStoreDataStub: VisualizationStoreData;

        beforeEach(() => {
            detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
            visualizationStoreDataStub = {
                selectedFastPassDetailsView: visualizationTypeStub,
            } as VisualizationStoreData;

            callback = testSubject.fastPassHandleCardViewResults(
                detailsViewActionMessageCreatorMock.object,
                visualizationStoreDataStub,
            );
        });

        afterEach(() => {
            detailsViewActionMessageCreatorMock.verifyAll();
        });

        it.each([
            [true, 0],
            [true, 1],
        ])(
            'does nothing if issues enabled is %s and card count is %s',
            (issuesEnabled: boolean, cardCount: number) => {
                detailsViewActionMessageCreatorMock
                    .setup(creator =>
                        creator.enableFastPassVisualHelperWithoutScan(visualizationTypeStub),
                    )
                    .verifiable(Times.never());

                detailsViewActionMessageCreatorMock
                    .setup(creator =>
                        creator.rescanVisualizationWithoutTelemetry(visualizationTypeStub),
                    )
                    .verifiable(Times.never());

                callback(issuesEnabled, cardCount);
            },
        );

        it('calls enableFastPassVisualHelperWithoutScan when issues are disabled and greater than 0 cards', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator =>
                    creator.enableFastPassVisualHelperWithoutScan(visualizationTypeStub),
                )
                .verifiable(Times.once());

            callback(false, 1);
        });

        it('calls rescanVisualizationWithoutTelemetry when issues are disabled and no cards', () => {
            detailsViewActionMessageCreatorMock
                .setup(creator =>
                    creator.rescanVisualizationWithoutTelemetry(visualizationTypeStub),
                )
                .verifiable(Times.once());

            callback(false, 0);
        });
    });

    describe('getAssessmentHandleCardViewResults', () => {
        let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
        let assessmentStoreDataStub: AssessmentStoreData;

        beforeEach(() => {
            assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
            assessmentStoreDataStub = {
                assessmentNavState: { selectedTestType: visualizationTypeStub },
            } as AssessmentStoreData;

            callback = testSubject.getAssessmentHandleCardViewResults(
                assessmentActionMessageCreatorMock.object,
                assessmentStoreDataStub,
            );
        });

        afterEach(() => {
            assessmentActionMessageCreatorMock.verifyAll();
        });

        it.each([
            [false, 1],
            [true, 0],
            [true, 1],
        ])(
            'does nothing if issues enabled is %s and card count is %s',
            (issuesEnabled: boolean, cardCount: number) => {
                assessmentActionMessageCreatorMock
                    .setup(creator => creator.startOverTestWithoutTelemetry(visualizationTypeStub))
                    .verifiable(Times.never());

                callback(issuesEnabled, cardCount);
            },
        );

        it('calls startOverTestWithoutTelemetry when issues are disabled and no cards', () => {
            assessmentActionMessageCreatorMock
                .setup(creator => creator.startOverTestWithoutTelemetry(visualizationTypeStub))
                .verifiable(Times.once());

            callback(false, 0);
        });
    });
});
