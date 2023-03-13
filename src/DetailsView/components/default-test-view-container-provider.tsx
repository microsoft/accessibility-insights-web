// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
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
                handleCardCountResults={this.fastPassHandleCardViewResults(
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
                handleCardCountResults={this.fastPassHandleCardViewResults(
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
                handleCardCountResults={this.getAssessmentHandleCardViewResults(
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

    private fastPassHandleCardViewResults(
        detailsViewActionMessageCreator: DetailsViewActionMessageCreator,
        visualizationStoreData: VisualizationStoreData,
    ): (issuesEnabled: boolean, cardCount: number) => void {
        const callback = (issuesEnabled: boolean, cardCount: number): void => {
            if (!issuesEnabled && cardCount > 0) {
                detailsViewActionMessageCreator.enableFastPassVisualHelperWithoutScan(
                    visualizationStoreData.selectedFastPassDetailsView,
                );
            }
            if (!issuesEnabled && cardCount === 0) {
                detailsViewActionMessageCreator.rescanVisualizationWithoutTelemetry(
                    visualizationStoreData.selectedFastPassDetailsView,
                );
            }
        };
        return callback;
    }

    private getAssessmentHandleCardViewResults(
        assessmentActionMessageCreator: AssessmentActionMessageCreator,
        assessmentStoreData: AssessmentStoreData,
    ): (issuesEnabled: boolean, cardCount: number) => void {
        const callback = (issuesEnabled: boolean, cardCount: number): void => {
            if (!issuesEnabled && cardCount === 0) {
                assessmentActionMessageCreator.startOverTest(
                    null,
                    assessmentStoreData?.assessmentNavState?.selectedTestType,
                );
            }
        };
        return callback;
    }
}
