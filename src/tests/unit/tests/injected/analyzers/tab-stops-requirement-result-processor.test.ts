// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { TabStopsRequirementResultProcessor } from 'injected/analyzers/tab-stops-requirement-result-processor';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { IMock, Mock } from 'typemoq';

describe('TabStopsRequirementResultProcessor', () => {
    let tabStopRequirementRunnerMock: IMock<AllFrameRunner<AutomatedTabStopRequirementResult>>;
    let featureFlagStoreMock: IMock<FeatureFlagStore>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let visualizationScanResultsStoreMock: IMock<VisualizationScanResultStore>;
    let visualizationScanResultsStoreState: VisualizationScanResultData;
    let testSubject: TabStopsRequirementResultProcessor;

    beforeEach(() => {
        tabStopRequirementRunnerMock = Mock.ofInstance({
            topWindowCallback: null,
            start: () => {},
            stop: () => {},
            initialize: () => {},
        } as AllFrameRunner<AutomatedTabStopRequirementResult>);
        featureFlagStoreMock = Mock.ofType<FeatureFlagStore>();
        tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>();
        visualizationScanResultsStoreMock = Mock.ofType<VisualizationScanResultStore>();
        visualizationScanResultsStoreState = null;

        visualizationScanResultsStoreMock
            .setup(sm => sm.getState())
            .returns(() => visualizationScanResultsStoreState);

        testSubject = new TabStopsRequirementResultProcessor(
            featureFlagStoreMock.object,
            tabStopRequirementRunnerMock.object,
            tabStopRequirementActionMessageCreatorMock.object,
            visualizationScanResultsStoreMock.object,
        );
    });

    describe('start', () => {
        //
    });

    describe('onStateChange', () => {
        //
    });

    describe('stop', () => {
        //
    });
});
