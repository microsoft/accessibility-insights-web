// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { FeatureFlags } from 'common/feature-flags';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { TabStopsRequirementResultProcessor } from 'injected/analyzers/tab-stops-requirement-result-processor';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TabStopsRequirementResultProcessor', () => {
    let tabStopRequirementRunnerMock: IMock<AllFrameRunner<AutomatedTabStopRequirementResult>>;
    let requirementResultRunnerCallback: (
        requirementResult: AutomatedTabStopRequirementResult,
    ) => void;
    let featureFlagStoreMock: IMock<FeatureFlagStore>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let visualizationScanResultsStoreMock: IMock<VisualizationScanResultStore>;
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

        testSubject = new TabStopsRequirementResultProcessor(
            featureFlagStoreMock.object,
            tabStopRequirementRunnerMock.object,
            tabStopRequirementActionMessageCreatorMock.object,
            visualizationScanResultsStoreMock.object,
        );
    });

    it('adds unique tab stop instances when processing tab stops requirement result', async () => {
        const requirementResult: AutomatedTabStopRequirementResult = {
            requirementId: 'keyboard-navigation',
            description: 'some description',
            selector: ['some', 'selector'],
            html: 'some html',
        } as AutomatedTabStopRequirementResult;
        const secondRequirementResult = {
            ...requirementResult,
            html: 'new html',
        };

        setTabStopsAutomationFeatureFlag(true);
        setupTabStopRequirementRunner();
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.addTabStopInstance(It.isValue(requirementResult)))
            .verifiable(Times.once());
        tabStopRequirementActionMessageCreatorMock
            .setup(m => m.addTabStopInstance(It.isValue(secondRequirementResult)))
            .verifiable(Times.once());

        testSubject.start();

        // send 1 duplicate and 2 unique results
        requirementResultRunnerCallback(requirementResult);
        requirementResultRunnerCallback(requirementResult);
        requirementResultRunnerCallback(secondRequirementResult);

        verifyAll();
    });

    describe('start', () => {
        it('starts requirement runner when feature flag is on', () => {
            setTabStopsAutomationFeatureFlag(true);
            setupTabStopRequirementRunner();

            testSubject.start();

            verifyAll();
        });
    });

    describe('stop', () => {
        beforeEach(() => {
            setTabStopsAutomationFeatureFlag(true);
        });

        it('runs only when not already in a stopped state', () => {
            const visualizationScanResultsStoreState = {
                tabStops: {
                    tabbingCompleted: true,
                    needToCollectTabbingResults: true,
                },
            } as VisualizationScanResultData;

            setupVisualizationScanResultStoreMock(visualizationScanResultsStoreState);
            tabStopRequirementRunnerMock.setup(t => t.stop()).verifiable(Times.once());
            tabStopRequirementActionMessageCreatorMock
                .setup(t => t.automatedTabbingResultsCompleted(It.isAny()))
                .verifiable(Times.once());
            tabStopRequirementActionMessageCreatorMock
                .setup(t => t.updateNeedToCollectTabbingResults(It.isAny()))
                .verifiable(Times.once());

            testSubject.start();
            testSubject.stop();
            testSubject.stop();

            verifyAll();
        });

        it('does not send tabbing results message if tabbing is not completed', () => {
            const visualizationScanResultsStoreState = {
                tabStops: {
                    tabbingCompleted: false,
                    needToCollectTabbingResults: true,
                },
            } as VisualizationScanResultData;

            setupVisualizationScanResultStoreMock(visualizationScanResultsStoreState);

            tabStopRequirementRunnerMock.setup(t => t.stop()).verifiable(Times.once());
            tabStopRequirementActionMessageCreatorMock
                .setup(t => t.automatedTabbingResultsCompleted(It.isAny()))
                .verifiable(Times.never());
            tabStopRequirementActionMessageCreatorMock
                .setup(t => t.updateNeedToCollectTabbingResults(It.isAny()))
                .verifiable(Times.never());

            testSubject.start();
            testSubject.stop();
            verifyAll();
        });

        it('does not send tabbing results message if needToCollectTabbingResults is false', () => {
            const visualizationScanResultsStoreState = {
                tabStops: {
                    tabbingCompleted: true,
                    needToCollectTabbingResults: false,
                },
            } as VisualizationScanResultData;

            setupVisualizationScanResultStoreMock(visualizationScanResultsStoreState);

            tabStopRequirementRunnerMock.setup(t => t.stop()).verifiable(Times.once());
            tabStopRequirementActionMessageCreatorMock
                .setup(t => t.automatedTabbingResultsCompleted(It.isAny()))
                .verifiable(Times.never());
            tabStopRequirementActionMessageCreatorMock
                .setup(t => t.updateNeedToCollectTabbingResults(It.isAny()))
                .verifiable(Times.never());

            testSubject.start();
            testSubject.stop();
            verifyAll();
        });

        it('stops the requirement runner and sends tabbing results completed message', () => {
            setupTabStopRequirementRunner();
            requirementResultRunnerCallback({} as AutomatedTabStopRequirementResult);

            testSubject.start();
            verifyAll();
        });
    });

    function verifyAll(): void {
        visualizationScanResultsStoreMock.verifyAll();
        tabStopRequirementRunnerMock.verifyAll();
        tabStopRequirementActionMessageCreatorMock.verifyAll();
    }

    function setupVisualizationScanResultStoreMock(
        visualizationScanResultsStoreState: VisualizationScanResultData,
    ): void {
        visualizationScanResultsStoreMock
            .setup(sm => sm.getState())
            .returns(() => visualizationScanResultsStoreState)
            .verifiable(Times.once());
    }

    function setupTabStopRequirementRunner(): void {
        tabStopRequirementRunnerMock
            .setup(t => (t.topWindowCallback = It.is(isFunction)))
            .callback(cb => (requirementResultRunnerCallback = cb))
            .verifiable(Times.once());
        tabStopRequirementRunnerMock.setup(t => t.start()).verifiable(Times.once());
    }

    function setTabStopsAutomationFeatureFlag(enabled: boolean) {
        featureFlagStoreMock
            .setup(m => m.getState())
            .returns(() => ({
                [FeatureFlags.tabStopsAutomation]: enabled,
            }));
    }
});
