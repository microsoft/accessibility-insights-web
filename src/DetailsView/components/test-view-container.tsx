// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { NeedsReviewCardSelectionMessageCreator } from 'common/message-creators/needs-review-card-selection-message-creator';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { AdhocStaticTestView } from 'DetailsView/components/adhoc-static-test-view';
import {
    AdhocTabStopsTestView,
    AdhocTabStopsTestViewDeps,
} from 'DetailsView/components/adhoc-tab-stops-test-view';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import * as React from 'react';
import { VisualizationConfigurationFactory } from '../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../common/react/named-fc';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { CardsViewModel } from '../../common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { AdhocIssuesTestView } from './adhoc-issues-test-view';
import { AssessmentTestView } from './assessment-test-view';
import { IssuesTableHandler } from './issues-table-handler';
import { OverviewContainerDeps } from './overview-content/overview-content-container';
import { TestViewDeps } from './test-view';

export type TestViewContainerDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    automatedChecksCardSelectionMessageCreator: AutomatedChecksCardSelectionMessageCreator;
    needsReviewCardSelectionMessageCreator: NeedsReviewCardSelectionMessageCreator;
} & TestViewDeps &
    OverviewContainerDeps &
    AdhocTabStopsTestViewDeps;

export interface TestViewContainerProps {
    deps: TestViewContainerDeps;
    tabStoreData: TabStoreData;
    tabStopsViewStoreData: TabStopsViewStoreData;
    assessmentStoreData: AssessmentStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    cardsViewStoreData: CardsViewStoreData;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    issuesTableHandler: IssuesTableHandler;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    automatedChecksCardsViewData: CardsViewModel;
    needsReviewCardsViewData: CardsViewModel;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
    narrowModeStatus: NarrowModeStatus;
}

export const TestViewContainer = NamedFC<TestViewContainerProps>('TestViewContainer', props => {
    const configuration = props.visualizationConfigurationFactory.getConfiguration(
        props.selectedTest,
    );
    const testViewProps = { configuration, ...configuration.testViewOverrides, ...props };

    switch (configuration.testViewType) {
        case 'AdhocStatic':
            return <AdhocStaticTestView {...testViewProps} />;
        case 'AdhocFailure':
            return (
                <AdhocIssuesTestView
                    instancesSection={FailedInstancesSection}
                    cardSelectionMessageCreator={
                        props.deps.automatedChecksCardSelectionMessageCreator
                    }
                    cardsViewData={props.automatedChecksCardsViewData}
                    {...testViewProps}
                />
            );
        case 'AdhocNeedsReview':
            return (
                <AdhocIssuesTestView
                    cardsViewData={props.needsReviewCardsViewData}
                    cardSelectionMessageCreator={props.deps.needsReviewCardSelectionMessageCreator}
                    instancesSection={NeedsReviewInstancesSection}
                    {...testViewProps}
                />
            );
        case 'AdhocTabStops':
            return <AdhocTabStopsTestView {...testViewProps} />;
        case 'Assessment':
            return <AssessmentTestView {...testViewProps} />;
    }
});
