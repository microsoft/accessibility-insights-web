// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { AdhocIssuesTestView } from 'DetailsView/components/adhoc-issues-test-view';
import { AdhocStaticTestView } from 'DetailsView/components/adhoc-static-test-view';
import { AdhocTabStopsTestView } from 'DetailsView/components/adhoc-tab-stops-test-view';
import { AssessmentTestView } from 'DetailsView/components/assessment-test-view';
import {
    TestViewContainerProvider,
    TestViewContainerProviderProps,
} from 'DetailsView/components/test-view-container-provider';
import React from 'react';

export class DefaultTestViewContainerProvider implements TestViewContainerProvider {
    public createStaticTestViewContainer(props: TestViewContainerProviderProps): JSX.Element {
        return <AdhocStaticTestView {...props} />;
    }

    public createTabStopsTestViewContainer(props: TestViewContainerProviderProps): JSX.Element {
        return <AdhocTabStopsTestView {...props} />;
    }

    public createNeedsReviewTestViewContainer(props: TestViewContainerProviderProps): JSX.Element {
        return (
            <AdhocIssuesTestView
                cardsViewData={props.needsReviewCardsViewData}
                cardSelectionMessageCreator={props.needsReviewCardSelectionMessageCreator}
                instancesSection={NeedsReviewInstancesSection}
                handleCardCountResults={props.cardViewResultsHandler.fastPassHandleCardViewResults(
                    props.detailsViewActionMessageCreator,
                    props.visualizationStoreData,
                )}
                {...props}
            />
        );
    }

    public createIssuesTestViewContainer(props: TestViewContainerProviderProps): JSX.Element {
        return (
            <AdhocIssuesTestView
                instancesSection={FailedInstancesSection}
                cardSelectionMessageCreator={props.automatedChecksCardSelectionMessageCreator}
                cardsViewData={props.automatedChecksCardsViewData}
                handleCardCountResults={props.cardViewResultsHandler.fastPassHandleCardViewResults(
                    props.detailsViewActionMessageCreator,
                    props.visualizationStoreData,
                )}
                {...props}
            />
        );
    }

    public createAssessmentAutomatedChecksTestViewContainer(
        props: TestViewContainerProviderProps,
    ): JSX.Element {
        return (
            <AdhocIssuesTestView
                instancesSection={FailedInstancesSection}
                cardSelectionMessageCreator={props.assessmentCardSelectionMessageCreator}
                cardsViewData={props.assessmentCardsViewData}
                handleCardCountResults={props.cardViewResultsHandler.getAssessmentHandleCardViewResults(
                    props.assessmentActionMessageCreator,
                    props.assessmentStoreData,
                )}
                includeStepsText={false}
                {...props}
            />
        );
    }

    public createAssessmentTestViewContainer(props: TestViewContainerProviderProps): JSX.Element {
        return <AssessmentTestView {...props} />;
    }
}
