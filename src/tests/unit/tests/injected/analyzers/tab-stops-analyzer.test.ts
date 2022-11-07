// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Message } from 'common/message';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { VisualizationType } from 'common/types/visualization-type';
import { AllFrameRunner } from 'injected/all-frame-runner';
import { FocusAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { FocusAnalyzerMessageConfiguration } from 'injected/analyzers/get-analyzer-message-types';
import { TabStopsAnalyzer } from 'injected/analyzers/tab-stops-analyzer';
import { TabStopsDoneAnalyzingTracker } from 'injected/analyzers/tab-stops-done-analyzing-tracker';
import { TabStopsRequirementResultProcessor } from 'injected/analyzers/tab-stops-requirement-result-processor';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
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
    let simulateTabEvent: (tabEvent: TabStopEvent) => void;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;
    let emptyScanCompleteMessage: Message;
    let debounceFaker: DebounceFaker<() => void>;
    let tabStopsDoneAnalyzingTrackerMock: IMock<TabStopsDoneAnalyzingTracker>;
    let tabStopsRequirementResultProcessorMock: IMock<TabStopsRequirementResultProcessor>;
    let messageConfigurationStub: FocusAnalyzerMessageConfiguration;

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
        messageConfigurationStub = {
            analyzerMessageType: 'some message type',
            analyzerTerminatedMessageType: 'some terminated message',
            analyzerProgressMessageType: 'some progress message',
        };
        simulateTabEvent = null;
        debounceFaker = new DebounceFaker();
        tabStopsListenerMock = Mock.ofInstance({
            topWindowCallback: null,
            start: () => {},
            stop: () => {},
            initialize: () => {},
        } as AllFrameRunner<TabStopEvent>);
        tabStopsDoneAnalyzingTrackerMock = Mock.ofType<TabStopsDoneAnalyzingTracker>(
            null,
            MockBehavior.Strict,
        );
        tabStopsRequirementResultProcessorMock = Mock.ofType<TabStopsRequirementResultProcessor>();

        scanIncompleteWarningDetectorMock
            .setup(idm => idm.detectScanIncompleteWarnings())
            .returns(() => []);

        testSubject = new TabStopsAnalyzer(
            configStub,
            tabStopsListenerMock.object,
            sendMessageMock.object,
            scanIncompleteWarningDetectorMock.object,
            failTestOnErrorLogger,
            tabStopsDoneAnalyzingTrackerMock.object,
            tabStopsRequirementResultProcessorMock.object,
            debounceFaker.debounce,
        );
        visualizationTypeStub = -1 as VisualizationType;

        emptyScanCompleteMessage = {
            messageType: messageConfigurationStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: {},
                testType: visualizationTypeStub,
                scanIncompleteWarnings: [],
                scanResult: undefined,
            },
        };
    });

    describe('analyze', () => {
        let expectedScanUpdatedMessage: Message;

        beforeEach(() => {
            expectedScanUpdatedMessage = {
                messageType: messageConfigurationStub.analyzerProgressMessageType,
                payload: {
                    key: configStub.key,
                    testType: configStub.testType,
                    tabbedElements: [tabEventStub1],
                    results: [tabEventStub1],
                },
            };

            setupTabStopsListenerForStartTabStops();
            tabStopsDoneAnalyzingTrackerMock.setup(m => m.reset()).verifiable(Times.once());
            setupSendMessageMock(emptyScanCompleteMessage);
        });

        it('emits an empty ScanCompleted message immediately on startup', async () => {
            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);

            testSubject.analyze(messageConfigurationStub);
            await flushSettledPromises();

            verifyAll();
        });

        it('emits ScanUpdated messages when tab events are detected', async () => {
            testSubject.analyze(messageConfigurationStub);
            await flushSettledPromises();

            tabStopsDoneAnalyzingTrackerMock
                .setup(m => m.addTabStopEvents([tabEventStub1]))
                .verifiable(Times.once());

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);

            debounceFaker.flush();

            verifyAll();
        });

        it('passes tab events to done-analyzing-tracker', async () => {
            testSubject.analyze(messageConfigurationStub);
            await flushSettledPromises();

            tabStopsDoneAnalyzingTrackerMock
                .setup(m => m.addTabStopEvents([tabEventStub1]))
                .verifiable(Times.once());

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);

            debounceFaker.flush();

            verifyAll();
        });

        it('starts tabStopsRequirementResultProcessor', async () => {
            tabStopsRequirementResultProcessorMock.setup(m => m.start()).verifiable(Times.once());

            testSubject.analyze(messageConfigurationStub);
            await flushSettledPromises();

            tabStopsDoneAnalyzingTrackerMock
                .setup(m => m.addTabStopEvents([tabEventStub1]))
                .verifiable(Times.once());

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);

            debounceFaker.flush();

            verifyAll();
        });

        it('does not start tabStopsRequirementResultProcessor when it is null', async () => {
            testSubject = new TabStopsAnalyzer(
                configStub,
                tabStopsListenerMock.object,
                sendMessageMock.object,
                scanIncompleteWarningDetectorMock.object,
                failTestOnErrorLogger,
                tabStopsDoneAnalyzingTrackerMock.object,
                null,
                debounceFaker.debounce,
            );

            tabStopsRequirementResultProcessorMock.setup(m => m.start()).verifiable(Times.never());

            testSubject.analyze(messageConfigurationStub);
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
                messageType: messageConfigurationStub.analyzerProgressMessageType,
                payload: {
                    key: configStub.key,
                    testType: configStub.testType,
                    tabbedElements: [tabEventStub1, tabEventStub2],
                    results: [tabEventStub1, tabEventStub2],
                },
            };

            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);

            testSubject.analyze(messageConfigurationStub);
            await flushSettledPromises();

            tabStopsDoneAnalyzingTrackerMock
                .setup(m => m.addTabStopEvents([tabEventStub1, tabEventStub2]))
                .verifiable(Times.once());

            setupSendMessageMock(expectedScanUpdatedMessage);
            simulateTabEvent(tabEventStub1);
            simulateTabEvent(tabEventStub2);

            debounceFaker.flush();

            verifyAll();
        });

        it('emits a ScanTerminated message and stops emitting ScanUpdated messages after teardown() is invoked', async () => {
            setupTabStopsListenerForStartTabStops();
            setupSendMessageMock(emptyScanCompleteMessage);

            testSubject.analyze(messageConfigurationStub);
            await flushSettledPromises();

            tabStopsListenerMock.setup(tslm => tslm.stop()).verifiable(Times.once());

            setupSendMessageMock({
                messageType: messageConfigurationStub.analyzerTerminatedMessageType,
                payload: { key: configStub.key, testType: configStub.testType },
            });

            await testSubject.teardown();
            await flushSettledPromises();
            verifyAll();

            simulateTabEvent(tabEventStub1); // no corresponding setupSendMessageMock
            debounceFaker.flush();
            verifyAll();
        });
    });

    describe('teardown', () => {
        let expectedTeardownMessage: Message;

        beforeEach(() => {
            expectedTeardownMessage = {
                messageType: messageConfigurationStub.analyzerTerminatedMessageType,
                payload: {
                    key: configStub.key,
                    testType: configStub.testType,
                },
            };

            tabStopsListenerMock.setup(m => m.stop()).verifiable(Times.once());
            setupSendMessageMock(expectedTeardownMessage);
        });

        it('stops processors when teardown() is invoked', async () => {
            tabStopsRequirementResultProcessorMock.setup(m => m.stop()).verifiable(Times.once());

            (testSubject as any).messageConfiguration = messageConfigurationStub;
            await testSubject.teardown();

            verifyAll();
        });

        it('does not stop tabStopsRequirementResultProcessor when it is null', async () => {
            testSubject = new TabStopsAnalyzer(
                configStub,
                tabStopsListenerMock.object,
                sendMessageMock.object,
                scanIncompleteWarningDetectorMock.object,
                failTestOnErrorLogger,
                tabStopsDoneAnalyzingTrackerMock.object,
                null,
                debounceFaker.debounce,
            );

            (testSubject as any).messageConfiguration = messageConfigurationStub;
            await testSubject.teardown();

            verifyAll();
        });

        // Teardown is only called after analyze is called, setting up the message configuration.
        it('no message is sent without a message configuration', async () => {
            sendMessageMock.reset();

            await testSubject.teardown();

            sendMessageMock.verify(m => m(It.isAny()), Times.never());
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

    function setupSendMessageMock(message, callback?): void {
        sendMessageMock.reset();
        sendMessageMock
            .setup(smm => smm(It.isValue(message)))
            .callback(callback)
            .verifiable();
    }
});
