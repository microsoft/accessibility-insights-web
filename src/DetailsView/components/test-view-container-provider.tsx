// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { AdhocIssuesTestView } from 'DetailsView/components/adhoc-issues-test-view';
import { AdhocStaticTestView } from 'DetailsView/components/adhoc-static-test-view';
import { AdhocTabStopsTestView } from 'DetailsView/components/adhoc-tab-stops-test-view';
import { AssessmentTestView } from 'DetailsView/components/assessment-test-view';
import { ITestViewContainerProvider } from 'DetailsView/components/itest-view-container-provider';
import React from 'react';

export class TestViewContainerProvider implements ITestViewContainerProvider {
    public createStaticTestViewContainer(props: any) {
        return <AdhocStaticTestView {...props} />;
    }

    public createTabStopsTestViewContainer(props: any) {
        return <AdhocTabStopsTestView {...props} />;
    }

    public createNeedsReviewTestViewContainer(props: any) {
        return (
            <AdhocIssuesTestView
                cardsViewData={props.needsReviewCardsViewData}
                cardSelectionMessageCreator={props.deps.needsReviewCardSelectionMessageCreator}
                instancesSection={NeedsReviewInstancesSection}
                {...props}
            />
        );
    }

    public createIssuesTestViewContainer(props: any) {
        return (
            <AdhocIssuesTestView
                instancesSection={FailedInstancesSection}
                cardSelectionMessageCreator={props.deps.automatedChecksCardSelectionMessageCreator}
                cardsViewData={props.automatedChecksCardsViewData}
                {...props}
            />
        );
    }

    public createAssessmentTestViewContainer(props: any) {
        return <AssessmentTestView {...props} />;
    }
}
