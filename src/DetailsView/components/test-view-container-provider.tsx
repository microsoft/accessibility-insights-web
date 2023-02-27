// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { AdhocIssuesTestViewProps } from 'DetailsView/components/adhoc-issues-test-view';
import { AdhocStaticTestViewProps } from 'DetailsView/components/adhoc-static-test-view';
import { AdhocTabStopsTestViewProps } from 'DetailsView/components/adhoc-tab-stops-test-view';
import { AssessmentTestViewProps } from 'DetailsView/components/assessment-test-view';

export type TestViewContainerProviderProps = {
    needsReviewCardsViewData: CardsViewModel;
    needsReviewCardSelectionMessageCreator: CardSelectionMessageCreator;
    automatedChecksCardsViewData: CardsViewModel;
    automatedChecksCardSelectionMessageCreator: CardSelectionMessageCreator;
} & Omit<
    AdhocIssuesTestViewProps,
    'instancesSection' | 'cardSelectionMessageCreator' | 'cardsViewData'
> &
    AdhocStaticTestViewProps &
    AdhocTabStopsTestViewProps &
    AssessmentTestViewProps;

export interface TestViewContainerProvider {
    createStaticTestViewContainer(props: TestViewContainerProviderProps): JSX.Element;
    createTabStopsTestViewContainer(props: TestViewContainerProviderProps): JSX.Element;
    createNeedsReviewTestViewContainer(props: TestViewContainerProviderProps): JSX.Element;
    createIssuesTestViewContainer(props: TestViewContainerProviderProps): JSX.Element;
    createAssessmentTestViewContainer(props: TestViewContainerProviderProps): JSX.Element;
}
