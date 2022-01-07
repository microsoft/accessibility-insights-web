// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.

// import { Message } from 'common/message';
// import { Messages } from 'common/messages';
// import { TabStopEvent } from 'common/types/tab-stop-event';
// import { FocusAnalyzerConfiguration } from 'injected/analyzers/analyzer';
// import { AutomatedTabStopsAnalyzer } from 'injected/analyzers/automated-tab-stops-analyzer';
// import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
// import { TabStopsListener } from 'injected/tab-stops-listener';
// import { TabbableElementGetter, TabbableElementInfo } from 'injected/tabbable-element-getter';
// import { DebounceFaker } from 'tests/unit/common/debounce-faker';
// import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

// describe('AutomatedTabStopsAnalyzer', () => {
//     let sendMessageMock: IMock<(message) => void>;
//     let configStub: FocusAnalyzerConfiguration;
//     let testSubject: AutomatedTabStopsAnalyzer;
//     let tabStopsListenerMock: IMock<TabStopsListener>;
//     let simulateTabEvent: (tabEvent: TabStopEvent) => void;
//     let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;
//     let calculatedTabStopsResultsMessage: Message;
//     let debounceFaker: DebounceFaker<() => void>;
//     let tabbableElementGetterMock: IMock<TabbableElementGetter>;
//     let calculatedTabStopsStub: TabbableElementInfo[];
//     const tabEventStub1: TabStopEvent = {
//         target: ['selector1'],
//         html: 'test',
//         timestamp: 1,
//     };
//     const tabEventStub2: TabStopEvent = {
//         target: ['selector2'],
//         html: 'test',
//         timestamp: 2,
//     };

//     beforeEach(() => {
//         tabbableElementGetterMock = Mock.ofType<TabbableElementGetter>();
//         scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
//         sendMessageMock = Mock.ofInstance(message => {}, MockBehavior.Strict);
//         configStub = {
//             analyzerProgressMessageType: 'ScanUpdated message type',
//             analyzerTerminatedMessageType: 'ScanTerminated message type',
//             analyzerMessageType: 'ScanCompleted message type',
//             key: 'sample key',
//             testType: -1,
//         };
//         simulateTabEvent = null;
//         debounceFaker = new DebounceFaker();
//         calculatedTabStopsStub = [{ html: 'some html', selector: 'some selector', order: 0 }];
//         tabStopsListenerMock = Mock.ofType(TabStopsListener);

//         scanIncompleteWarningDetectorMock
//             .setup(idm => idm.detectScanIncompleteWarnings())
//             .returns(() => []);

//         testSubject = new AutomatedTabStopsAnalyzer(
//             configStub,
//             tabStopsListenerMock.object,
//             sendMessageMock.object,
//             tabbableElementGetterMock.object,
//             debounceFaker.debounce,
//         );
//         calculatedTabStopsResultsMessage = {
//             payload: {
//                 calculatedTabStops: calculatedTabStopsStub,
//             },
//             messageType: Messages.Visualizations.TabStops.ScanCompleted,
//         };
//         tabbableElementGetterMock.setup(m => m.get()).returns(() => calculatedTabStopsStub);
//     });

//     describe('analyze', () => {
//         it('sends calculated tab stops', () => {
//             setupTabStopsListenerForStartTabStops();
//             setupSendMessageMock(calculatedTabStopsResultsMessage);

//             testSubject.analyze();

//             verifyAll();
//         });

//         it('emits ScanUpdated messages when tab events are detected', () => {
//             const expectedScanUpdatedMessage: Message = {
//                 messageType: configStub.analyzerProgressMessageType,
//                 payload: {
//                     key: configStub.key,
//                     testType: configStub.testType,
//                     tabbedElements: [tabEventStub1],
//                     results: [tabEventStub1],
//                 },
//             };

//             setupTabStopsListenerForStartTabStops();
//             setupSendMessageMock(calculatedTabStopsResultsMessage);
//             testSubject.analyze();

//             setupSendMessageMock(expectedScanUpdatedMessage);
//             simulateTabEvent(tabEventStub1);

//             debounceFaker.flush();

//             verifyAll();
//         });

//         it('batches ScanUpdated messages for tab events detected in quick succession', () => {
//             const expectedScanUpdatedMessage: Message = {
//                 messageType: configStub.analyzerProgressMessageType,
//                 payload: {
//                     key: configStub.key,
//                     testType: configStub.testType,
//                     tabbedElements: [tabEventStub1, tabEventStub2],
//                     results: [tabEventStub1, tabEventStub2],
//                 },
//             };

//             setupTabStopsListenerForStartTabStops();
//             setupSendMessageMock(calculatedTabStopsResultsMessage);
//             testSubject.analyze();

//             setupSendMessageMock(expectedScanUpdatedMessage);
//             simulateTabEvent(tabEventStub1);
//             simulateTabEvent(tabEventStub2);

//             debounceFaker.flush();

//             verifyAll();
//         });

//         it('emits a ScanTerminated message and stops emitting ScanUpdated messages after teardown() is invoked', () => {
//             setupTabStopsListenerForStartTabStops();
//             setupSendMessageMock(calculatedTabStopsResultsMessage);
//             testSubject.analyze();

//             tabStopsListenerMock
//                 .setup(tslm => tslm.stopListenToTabStops())
//                 .verifiable(Times.once());
//             setupSendMessageMock({
//                 messageType: configStub.analyzerTerminatedMessageType,
//                 payload: { key: configStub.key, testType: configStub.testType },
//             });

//             testSubject.teardown();
//             verifyAll();

//             simulateTabEvent(tabEventStub1); // no corresponding setupSendMessageMock
//             debounceFaker.flush();
//             verifyAll();
//         });
//     });

//     function verifyAll(): void {
//         tabStopsListenerMock.verifyAll();
//         sendMessageMock.verifyAll();
//     }

//     function setupTabStopsListenerForStartTabStops(): void {
//         tabStopsListenerMock
//             .setup(tslm => tslm.setTabEventListenerOnMainWindow(It.isAny()))
//             .callback((callback: (tabEvent: TabStopEvent) => void) => {
//                 simulateTabEvent = callback;
//             })
//             .verifiable(Times.once());

//         tabStopsListenerMock.setup(t => t.startListenToTabStops()).verifiable(Times.once());
//     }

//     function setupSendMessageMock(message, callback?): void {
//         sendMessageMock
//             .setup(smm => smm(It.isValue(message)))
//             .callback(callback)
//             .verifiable();
//     }
// });
