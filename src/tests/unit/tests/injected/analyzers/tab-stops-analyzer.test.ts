// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { FeatureFlags } from 'common/feature-flags';
import { Message } from 'common/message';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { VisualizationType } from 'common/types/visualization-type';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { FocusAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { TabStopsAnalyzer } from 'injected/analyzers/tab-stops-analyzer';
import { TabStopsDoneAnalyzingTracker } from 'injected/analyzers/tab-stops-done-analyzing-tracker';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { DebounceFaker } from 'tests/unit/common/debounce-faker';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('TabStopsAnalyzer', () => {
    let sendMessageMock: IMock<(message) => void>;
    let configStub: FocusAnalyzerConfiguration;
    let visualizationTypeStub: VisualizationType;
    let testSubject: TabStopsAnalyzer;
    let tabStopsListenerMock: IMock<AllFrameRunner<TabStopEvent>>;
    let tabStopRequirementRunnerMock: IMock<AllFrameRunner<AutomatedTabStopRequirementResult>>;
    let simulateTabEvent: (tabEvent: TabStopEvent) => void;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;
    let emptyScanCompleteMessage: Message;
    let debounceFaker: DebounceFaker<() => void>;
    let featureFlagStoreMock: IMock<FeatureFlagStore>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;
    let tabStopsDoneAnalyzingTrackerMock: IMock<TabStopsDoneAnalyzingTracker>;
    let requirementResultRunnerCallback: (
        requirementResult: AutomatedTabStopRequirementResult,
    ) => void;

    const tabEventStub1: TabStopEvent = {
        target: ['selector1'],
        html: 'test',
        timestamp: 1,
    };
    const tabEventStub2: TabStopEvent = {
        target: ['selector2'],
        html: 'test',
        timestamp: 2,
    };

    beforeEach(() => {
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        sendMessageMock = Mock.ofInstance(message => {}, MockBehavior.Strict);
        configStub = {
            analyzerProgressMessageType: 'ScanUpdated message type',
            analyzerTerminatedMessageType: 'ScanTerminated message type',
            analyzerMessageType: 'ScanCompleted message type',
            key: 'sample key',
            testType: -1,
        };
        simulateTabEvent = null;
        debounceFaker = new DebounceFaker();
        tabStopsListenerMock = Mock.ofInstance({
            topWindowCallback: null,
            start: () => {},
            stop: () => {},
            initialize: () => {},
        } as AllFrameRunner<TabStopEvent>);
        tabStopRequirementRunnerMock = Mock.ofInstance({
            topWindowCallback: null,
            start: () => {},
            stop: () => {},
            initialize: () => {},
        } as AllFrameRunner<AutomatedTabStopRequirementResult>);
        tabStopsDoneAnalyzingTrackerMock = Mock.ofType<TabStopsDoneAnalyzingTracker>(
            null,
            MockBehavior.Strict,
        );

        scanIncompleteWarningDetectorMock
            .setup(idm => idm.detectScanIncompleteWarnings())
            .returns(() => []);
        featureFlagStoreMock = Mock.ofType<FeatureFlagStore>();
        tabStopRequirementActionMessageCreatorMock =
            Mock.ofType<TabStopRequirementActionMessageCreator>();

        testSubject = new TabStopsAnalyzer(
            configStub,
            tabStopsListenerMock.object,
            sendMessageMock.object,
            scanIncompleteWarningDetectorMock.object,
            failTestOnErrorLogger,
            featureFlagStoreMock.object,
            tabStopRequirementRunnerMock.object,
            tabStopRequirementActionMessageCreatorMock.object,
            tabStopsDoneAnalyzingTrackerMock.object,
            debounceFaker.debounce,
        );
        visualizationTypeStub = -1 as VisualizationType;

        emptyScanCompleteMessage = {
            messageType: configStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: {},
                scanResult: null,
                testType: visualizationTypeStub,
                scanIncompleteWarnings: [],
            },
        };
    });

    describe('analyze', () => {
        it('emits an empty ScanCompleted message immediately on startup', async () => {
            setTabStopsAutomationFeatureFlag(false);
            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);

            testSubject.analyze();
            await flushSettledPromises();

            verifyAll();
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
            setupTabStopsListenerForStartTabStops();
            tabStopsDoneAnalyzingTrackerMock.setup(m => m.reset()).verifiable(Times.once());
            setupTabStopRequirementRunner();
            setupSendMessageMock(emptyScanCompleteMessage);

            testSubject.analyze();
            await flushSettledPromises();

            // send 1 duplicate and 2 unique results
            requirementResultRunnerCallback(requirementResult);
            requirementResultRunnerCallback(requirementResult);
            requirementResultRunnerCallback(secondRequirementResult);

            tabStopRequirementActionMessageCreatorMock.verify(
                m => m.addTabStopInstance(It.isValue(requirementResult)),
                Times.once(),
            );
            tabStopRequirementActionMessageCreatorMock.verify(
                m => m.addTabStopInstance(It.isValue(secondRequirementResult)),
                Times.once(),
            );
        });

        it('emits ScanUpdated messages when tab events are detected', async () => {
            const expectedScanUpdatedMessage: Message = {
                messageType: configStub.analyzerProgressMessageType,
                payload: {
                    key: configStub.key,
                    testType: configStub.testType,
                    tabbedElements: [tabEventStub1],
                    results: [tabEventStub1],
                },
            };

            setTabStopsAutomationFeatureFlag(false);
            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);
            testSubject.analyze();
            await flushSettledPromises();

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);

            debounceFaker.flush();

            verifyAll();
        });

        it('passes tab events to done-analyzing-tracker when automation feature flag is enabled', async () => {
            const expectedScanUpdatedMessage: Message = {
                messageType: configStub.analyzerProgressMessageType,
                payload: {
                    key: configStub.key,
                    testType: configStub.testType,
                    tabbedElements: [tabEventStub1],
                    results: [tabEventStub1],
                },
            };

            setTabStopsAutomationFeatureFlag(true);
            setupTabStopsListenerForStartTabStops();
            tabStopsDoneAnalyzingTrackerMock.setup(m => m.reset()).verifiable(Times.once());
            setupSendMessageMock(emptyScanCompleteMessage);
            testSubject.analyze();
            await flushSettledPromises();

            tabStopsDoneAnalyzingTrackerMock
                .setup(m => m.addTabStopEvents([tabEventStub1]))
                .verifiable(Times.once());

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);

            debounceFaker.flush();

            verifyAll();
        });

        it('batches ScanUpdated messages for tab events detected in quick succession', async () => {
            const expectedScanUpdatedMessage: Message = {
                messageType: configStub.analyzerProgressMessageType,
                payload: {
                    key: configStub.key,
                    testType: configStub.testType,
                    tabbedElements: [tabEventStub1, tabEventStub2],
                    results: [tabEventStub1, tabEventStub2],
                },
            };

            setTabStopsAutomationFeatureFlag(false);
            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);
            testSubject.analyze();
            await flushSettledPromises();

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);
            simulateTabEvent(tabEventStub2);

            debounceFaker.flush();

            verifyAll();
        });

        it('emits a ScanTerminated message and stops emitting ScanUpdated messages after teardown() is invoked', async () => {
            setTabStopsAutomationFeatureFlag(false);
            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);
            testSubject.analyze();
            await flushSettledPromises();

            tabStopsListenerMock.setup(tslm => tslm.stop()).verifiable(Times.once());

            setupSendMessageMock({
                messageType: configStub.analyzerTerminatedMessageType,
                payload: { key: configStub.key, testType: configStub.testType },
            });

            testSubject.teardown();
            await flushSettledPromises();
            verifyAll();
            tabStopRequirementActionMessageCreatorMock.verify(
                m => m.automatedTabbingResultsCompleted([]),
                Times.exactly(1),
            );

            simulateTabEvent(tabEventStub1); // no corresponding setupSendMessageMock
            debounceFaker.flush();
            verifyAll();
        });
    });

    function verifyAll(): void {
        tabStopsDoneAnalyzingTrackerMock.verifyAll();
        tabStopsListenerMock.verifyAll();
        sendMessageMock.verifyAll();
    }

    function setupTabStopsListenerForStartTabStops(): void {
        tabStopsListenerMock
            .setup(t => (t.topWindowCallback = It.isAny()))
            .callback(cb => (simulateTabEvent = cb));
        tabStopsListenerMock.setup(t => t.start()).verifiable(Times.once());
    }

    function setupTabStopRequirementRunner(): void {
        tabStopRequirementRunnerMock
            .setup(t => (t.topWindowCallback = It.isAny()))
            .callback(cb => (requirementResultRunnerCallback = cb));
        tabStopRequirementRunnerMock.setup(t => t.start()).verifiable(Times.once());
    }

    function setTabStopsAutomationFeatureFlag(enabled: boolean) {
        featureFlagStoreMock
            .setup(m => m.getState())
            .returns(() => ({
                [FeatureFlags.tabStopsAutomation]: enabled,
            }));
    }

    function setupSendMessageMock(message, callback?): void {
        sendMessageMock.reset();
        sendMessageMock
            .setup(smm => smm(It.isValue(message)))
            .callback(callback)
            .verifiable();
    }
});
