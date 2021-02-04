// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Message } from 'common/message';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { VisualizationType } from 'common/types/visualization-type';
import { WindowUtils } from 'common/window-utils';
import { FocusAnalyzerConfiguration, ScanBasePayload } from 'injected/analyzers/analyzer';
import { TabStopsAnalyzer } from 'injected/analyzers/tab-stops-analyzer';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { TabStopsListener } from 'injected/tab-stops-listener';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { itIsFunction } from 'tests/unit/common/it-is-function';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('TabStopsAnalyzer', () => {
    let windowUtilsMock: IMock<WindowUtils>;
    let sendMessageMock: IMock<(message) => void>;
    let configStub: FocusAnalyzerConfiguration;
    let typeStub: VisualizationType;
    let testSubject: TabStopsAnalyzer;
    let tabStopsListenerMock: IMock<TabStopsListener>;
    let tabEventHandler: (tabEvent: TabStopEvent) => void;
    let setTimeOutCallBack: () => void;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        sendMessageMock = Mock.ofInstance(message => {}, MockBehavior.Strict);
        configStub = {
            analyzerProgressMessageType: 'sample progress message type',
            analyzerTerminatedMessageType: 'fun terminated message',
            analyzerMessageType: 'sample message type',
            key: 'sample key',
            testType: -1,
        };
        tabEventHandler = null;
        setTimeOutCallBack = null;
        tabStopsListenerMock = Mock.ofType(TabStopsListener);

        scanIncompleteWarningDetectorMock
            .setup(idm => idm.detectScanIncompleteWarnings())
            .returns(() => []);

        testSubject = new TabStopsAnalyzer(
            configStub,
            tabStopsListenerMock.object,
            windowUtilsMock.object,
            sendMessageMock.object,
            scanIncompleteWarningDetectorMock.object,
            failTestOnErrorLogger,
        );
        typeStub = -1 as VisualizationType;
    });

    test('analyze', (done: () => void) => {
        const tabEventStub: TabStopEvent = {
            target: ['selector'],
            html: 'test',
            timestamp: 1,
        };
        const resultsStub = {};
        const expectedBaseMessage: Message = {
            messageType: configStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: resultsStub,
                scanResult: null,
                testType: typeStub,
                scanIncompleteWarnings: [],
            },
        };
        const expectedOnProgressMessage: Message = {
            messageType: configStub.analyzerProgressMessageType,
            payload: {
                key: configStub.key,
                testType: configStub.testType,
                tabbedElements: [tabEventStub],
                results: [tabEventStub],
            },
        };

        setupTabStopsListenerForStartTabStops();
        setupWindowUtils();
        setupSendMessageMock(expectedBaseMessage);
        setupSendMessageMock(expectedOnProgressMessage, () => {
            verifyAll();
            expect((testSubject as any).onTabbedTimeoutId).toBeNull();
            done();
        });

        testSubject.analyze();

        tabEventHandler(tabEventStub);
        setTimeOutCallBack();
    });

    test('analyze: multiple events together (simulate timeoutId already created)', (completeSignal: () => void) => {
        const tabEventStub1: TabStopEvent = {
            target: ['selector'],
            html: 'test',
            timestamp: 1,
        };
        const tabEventStub2: TabStopEvent = {
            target: ['selector2'],
            html: 'test',
            timestamp: 2,
        };
        const onTabbedTimoutIdStub = -1;
        const resultsStub = {};
        const expectedBaseMessage: Message = {
            messageType: configStub.analyzerMessageType,
            payload: {
                key: configStub.key,
                selectorMap: resultsStub,
                scanResult: null,
                testType: typeStub,
                scanIncompleteWarnings: [],
            },
        };
        const expectedOnProgressMessage: Message = {
            messageType: configStub.analyzerProgressMessageType,
            payload: {
                key: configStub.key,
                testType: configStub.testType,
                tabbedElements: [tabEventStub1, tabEventStub2],
                results: [tabEventStub1, tabEventStub2],
            },
        };

        (testSubject as any).onTabbedTimeoutId = onTabbedTimoutIdStub;
        (testSubject as any).pendingTabbedElements = [tabEventStub1];

        setupTabStopsListenerForStartTabStops();
        setupWindowUtils();
        setupSendMessageMock(expectedBaseMessage);
        setupSendMessageMock(expectedOnProgressMessage, () => {
            verifyAll();
            expect((testSubject as any).onTabbedTimeoutId).toBeNull();
            completeSignal();
        });

        testSubject.analyze();

        tabEventHandler(tabEventStub2);
        setTimeOutCallBack();
    });

    test('teardown', () => {
        tabStopsListenerMock.setup(tslm => tslm.stopListenToTabStops()).verifiable(Times.once());

        const payload: ScanBasePayload = {
            key: configStub.key,
            testType: configStub.testType,
        };

        setupSendMessageMock({
            messageType: configStub.analyzerTerminatedMessageType,
            payload,
        });

        testSubject.teardown();

        verifyAll();
    });

    function verifyAll(): void {
        tabStopsListenerMock.verifyAll();
        windowUtilsMock.verifyAll();
        sendMessageMock.verifyAll();
    }

    function setupTabStopsListenerForStartTabStops(): void {
        tabStopsListenerMock
            .setup(tslm => tslm.setTabEventListenerOnMainWindow(It.isAny()))
            .callback((callback: (tabEvent: TabStopEvent) => void) => {
                tabEventHandler = callback;
            })
            .verifiable(Times.once());

        tabStopsListenerMock.setup(t => t.startListenToTabStops()).verifiable(Times.once());
    }

    function setupWindowUtils(): void {
        windowUtilsMock
            .setup(w => w.setTimeout(itIsFunction, 50))
            .callback((callback, timeout) => {
                setTimeOutCallBack = callback;
            })
            .verifiable(Times.once());
    }

    function setupSendMessageMock(message, callback?): void {
        sendMessageMock
            .setup(smm => smm(It.isValue(message)))
            .callback(callback)
            .verifiable();
    }
});
