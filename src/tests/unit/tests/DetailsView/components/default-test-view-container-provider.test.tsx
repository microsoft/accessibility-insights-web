// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionMessageCreator } from 'common/message-creators/assessment-card-selection-message-creator';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { NeedsReviewCardSelectionMessageCreator } from 'common/message-creators/needs-review-card-selection-message-creator';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CardViewResultsHandler } from 'DetailsView/components/card-view-results-handler';
import { DefaultTestViewContainerProvider } from 'DetailsView/components/default-test-view-container-provider';
import { TestViewContainerProviderProps } from 'DetailsView/components/test-view-container-provider';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('DefaultTestViewContainerProvider', () => {
    let testSubject: DefaultTestViewContainerProvider;
    let propsStub: TestViewContainerProviderProps;
    let cardViewResultsHandlerMock: IMock<CardViewResultsHandler>;

    beforeEach(() => {
        testSubject = new DefaultTestViewContainerProvider();
        cardViewResultsHandlerMock = Mock.ofType(CardViewResultsHandler, MockBehavior.Strict);
        propsStub = {
            automatedChecksCardSelectionMessageCreator:
                {} as AutomatedChecksCardSelectionMessageCreator,
            needsReviewCardSelectionMessageCreator: {} as NeedsReviewCardSelectionMessageCreator,
            assessmentCardSelectionMessageCreator: {} as AssessmentCardSelectionMessageCreator,
            assessmentActionMessageCreator: {} as AssessmentActionMessageCreator,
            detailsViewActionMessageCreator: {} as DetailsViewActionMessageCreator,
            someParentProp: 'parent-prop',
            visualizationScanResultData: {
                tabStops: {
                    requirements: {} as TabStopRequirementState,
                },
            },
            visualizationStoreData: {} as VisualizationStoreData,
            assessmentStoreData: {} as AssessmentStoreData,
            cardViewResultsHandler: cardViewResultsHandlerMock.object,
            needsReviewCardsViewData: {} as CardsViewModel,
            automatedChecksCardsViewData: {} as CardsViewModel,
            assessmentCardsViewData: {} as CardsViewModel,
        } as unknown as TestViewContainerProviderProps;
    });

    it('can create static test view container', () => {
        const element = testSubject.createStaticTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });

    it('can create tab stops test view container', () => {
        const element = testSubject.createTabStopsTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });

    it('can create needs review test view container', () => {
        cardViewResultsHandlerMock
            .setup(mock =>
                mock.fastPassHandleCardViewResults(
                    propsStub.detailsViewActionMessageCreator,
                    propsStub.visualizationStoreData,
                ),
            )
            .returns(() => () => {})
            .verifiable(Times.once());

        const element = testSubject.createNeedsReviewTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
        cardViewResultsHandlerMock.verifyAll();
    });

    it('can create issues test view container', () => {
        cardViewResultsHandlerMock
            .setup(mock =>
                mock.fastPassHandleCardViewResults(
                    propsStub.detailsViewActionMessageCreator,
                    propsStub.visualizationStoreData,
                ),
            )
            .returns(() => () => {})
            .verifiable(Times.once());

        const element = testSubject.createIssuesTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
        cardViewResultsHandlerMock.verifyAll();
    });

    it('can create assessment automated checks test view container', () => {
        cardViewResultsHandlerMock
            .setup(mock =>
                mock.getAssessmentHandleCardViewResults(
                    propsStub.assessmentActionMessageCreator,
                    propsStub.assessmentStoreData,
                ),
            )
            .returns(() => () => {})
            .verifiable(Times.once());

        const element = testSubject.createAssessmentAutomatedChecksTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
        cardViewResultsHandlerMock.verifyAll();
    });

    it('can create assessment test view container', () => {
        const element = testSubject.createAssessmentTestViewContainer(propsStub);
        expect(element).toMatchSnapshot();
    });
});
