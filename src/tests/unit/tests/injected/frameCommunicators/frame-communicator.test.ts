// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { HTMLElementUtils } from '../../../../../common/html-element-utils';
import { Logger } from '../../../../../common/logging/logger';
import {
    FrameCommunicator,
    MessageRequest,
} from '../../../../../injected/frameCommunicators/frame-communicator';
import {
    FrameMessageResponseCallback,
    WindowMessageHandler,
} from '../../../../../injected/frameCommunicators/window-message-handler';
import { HTMLCollectionOfBuilder } from '../../../common/html-collection-of-builder';
import { IsSameObject } from '../../../common/typemoq-helper';
import { QStub } from '../../../stubs/q-stub';

// These tests were written before we started enforcing no-floating-promises, and we've grandfathered in
// their warnings because they pervasively use a Q-mocking strategy that consistently trips the check.
// tslint:disable:no-floating-promises

interface FrameInfo {
    frameElement: HTMLIFrameElement;
    window: Window;
}

describe('FrameCommunicator', () => {
    let testSubject: FrameCommunicator;

    let childFrame1Info: FrameInfo;
    let childFrame2Info: FrameInfo;
    let childFrameWithoutWindowInfo: FrameInfo;

    let mockHtmlElementUtils: IMock<HTMLElementUtils>;
    let mockWindowMessageHandler: IMock<WindowMessageHandler>;

    let mockQ: IMock<typeof Q>;

    beforeEach(() => {
        mockWindowMessageHandler = Mock.ofType(WindowMessageHandler);
        mockHtmlElementUtils = Mock.ofType(HTMLElementUtils);

        childFrame1Info = createFrameInfo(true);
        childFrame2Info = createFrameInfo(true);
        childFrameWithoutWindowInfo = createFrameInfo(false);
        mockQ = Mock.ofType(QStub) as any;
        const loggerMock = Mock.ofType<Logger>();

        testSubject = new FrameCommunicator(
            mockWindowMessageHandler.object,
            mockHtmlElementUtils.object,
            mockQ.object,
            loggerMock.object,
        );

        mockHtmlElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() =>
                HTMLCollectionOfBuilder.create([
                    childFrame1Info.frameElement,
                    childFrame2Info.frameElement,
                    childFrameWithoutWindowInfo.frameElement,
                ]),
            );

        mockQ.setup(x => x.defer()).returns(() => Q.defer());
    });

    test('initializeShouldNotRegisterHandlerMoreThanOnce', () => {
        mockWindowMessageHandler
            .setup(x =>
                x.addSubscriber(
                    FrameCommunicator.PingCommand,
                    It.is((cb: FrameMessageResponseCallback) => cb != null),
                ),
            )
            .verifiable(Times.once());
        mockWindowMessageHandler
            .setup(x =>
                x.addSubscriber(
                    FrameCommunicator.DisposeCommand,
                    It.is((cb: FrameMessageResponseCallback) => cb != null),
                ),
            )
            .verifiable(Times.once());

        testSubject.initialize();
        testSubject.initialize();

        mockWindowMessageHandler.verifyAll();
    });

    test('verifyDispose', (done: () => void) => {
        const frameRequests: MessageRequest<any>[] = [];
        const frameRequestCompleteDeferred: Q.Deferred<any> = Q.defer<any>();
        const framesCompletedData = {};

        [childFrame1Info, childFrame2Info, childFrameWithoutWindowInfo].forEach(frameInfo => {
            const frameMessageRequest: MessageRequest<any> = {
                command: FrameCommunicator.DisposeCommand,
                frame: frameInfo.frameElement,
            };
            frameRequests.push(frameMessageRequest);
        });

        const executeForAllFrameRequestsStrictMock = mockExecuteRequestForAllFrameRequestsCall();
        executeForAllFrameRequestsStrictMock
            .setup(x => x(It.isAny(), FrameCommunicator.disposeTimeout))
            .callback((actualFrameRequests, timeout) => {
                expect(frameRequests).toMatchObject(actualFrameRequests);
            })
            .returns(() => frameRequestCompleteDeferred.promise)
            .verifiable(Times.once());

        testSubject.initialize();
        testSubject.dispose().then(data => {
            expect(framesCompletedData).toMatchObject(data);

            mockHtmlElementUtils.verifyAll();
            mockWindowMessageHandler.verifyAll();
            done();
        });

        mockWindowMessageHandler.setup(x => x.dispose()).verifiable(Times.never());
        mockWindowMessageHandler.verifyAll();
        mockWindowMessageHandler.reset();

        mockWindowMessageHandler.setup(x => x.dispose()).verifiable(Times.once());
        executeForAllFrameRequestsStrictMock.verifyAll();
        frameRequestCompleteDeferred.resolve(framesCompletedData);
    });

    test('verifyDisposeInIframe', () => {
        let disposeCallback: Function;
        const frameRequests: MessageRequest<any>[] = [];
        const frameRequestCompleteDeferred: Q.Deferred<
            Q.PromiseState<FrameMessageResponseCallback>[]
        > = Q.defer<Q.PromiseState<FrameMessageResponseCallback>[]>();

        mockWindowMessageHandler
            .setup(x => x.addSubscriber(FrameCommunicator.DisposeCommand, It.isAny()))
            .callback((command, callback) => {
                disposeCallback = callback;
            })
            .verifiable();

        mockHtmlElementUtils
            .setup(x => x.getAllElementsByTagName('iframe'))
            .returns(() =>
                HTMLCollectionOfBuilder.create([
                    childFrame1Info.frameElement,
                    childFrame2Info.frameElement,
                    childFrameWithoutWindowInfo.frameElement,
                ]),
            )
            .verifiable();

        [childFrame1Info, childFrame2Info, childFrameWithoutWindowInfo].forEach(frameInfo => {
            const frameMessageRequest: MessageRequest<any> = {
                command: FrameCommunicator.DisposeCommand,
                frame: frameInfo.frameElement,
            };
            frameRequests.push(frameMessageRequest);
        });

        const executeForAllFrameRequestsStrictMock = mockExecuteRequestForAllFrameRequestsCall();
        executeForAllFrameRequestsStrictMock
            .setup(x => x(It.isAny(), FrameCommunicator.disposeTimeout))
            .callback((actualFrameRequests, timeout) => {
                expect(frameRequests).toMatchObject(actualFrameRequests);
            })
            .returns(() => frameRequestCompleteDeferred.promise)
            .verifiable(Times.once());

        testSubject.initialize();
        disposeCallback();
        mockWindowMessageHandler.setup(x => x.dispose()).verifiable(Times.once());
        mockHtmlElementUtils.verifyAll();

        mockWindowMessageHandler.setup(x => x.dispose()).verifiable(Times.never());

        executeForAllFrameRequestsStrictMock.verifyAll();
        frameRequestCompleteDeferred.resolve([]);
    });

    test('verifyPingInIframe', () => {
        let pingCallback: Function;
        const winStub = {};
        const pingResponseFuncMock = Mock.ofInstance((data: any) => {});

        pingResponseFuncMock.setup(p => p(null)).verifiable();

        mockWindowMessageHandler
            .setup(x => x.addSubscriber(FrameCommunicator.PingCommand, It.isAny()))
            .callback((command, callback) => {
                pingCallback = callback;
            })
            .verifiable();

        testSubject.initialize();

        pingCallback(null, null, winStub, pingResponseFuncMock.object);

        pingResponseFuncMock.verifyAll();
    });

    test('verifySubscribe', () => {
        const responseCallback = () => {};

        mockWindowMessageHandler
            .setup(x => x.addSubscriber('command1', responseCallback))
            .verifiable();

        testSubject.initialize();

        testSubject.subscribe('command1', responseCallback);

        mockWindowMessageHandler.verifyAll();
    });

    test('verifyExecuteForAllFrameRequests', () => {
        const frameRequests: MessageRequest<any>[] = [];
        const frameRequestsPromises: Q.Promise<any>[] = [];
        const allSettledDeferred = Q.defer<any>();

        const sendMessageToFrameStrictMock = mockSendMessageToFrameCall();

        // mock sending message to each iframe
        [childFrame1Info, childFrame2Info, childFrameWithoutWindowInfo].forEach(frameInfo => {
            const frameMessageRequest: MessageRequest<any> = {
                command: FrameCommunicator.DisposeCommand,
                frame: frameInfo.frameElement,
            };
            frameRequests.push(frameMessageRequest);
            const deferred = Q.defer<FrameMessageResponseCallback>();
            frameRequestsPromises.push(deferred.promise);

            sendMessageToFrameStrictMock
                .setup(x => x(IsSameObject(frameMessageRequest)))
                .returns(() => deferred.promise)
                .verifiable(Times.once());
        });

        mockQ
            .setup(x => x.allSettled(It.isAny()))
            .callback(promises => {
                expect(promises).toMatchObject(frameRequestsPromises);
            })
            .returns(() => allSettledDeferred.promise)
            .verifiable();

        const timeoutDeferred = Q.defer<any>();
        const timeoutValue = 50;
        mockQ
            .setup(x => x.timeout(IsSameObject(allSettledDeferred.promise), timeoutValue))
            .returns(() => timeoutDeferred.promise)
            .verifiable();

        testSubject.initialize();

        const allFramesExecutedPromise = testSubject.executeRequestForAllFrameRequests(
            frameRequests,
            timeoutValue,
        );

        expect(timeoutDeferred.promise).toEqual(allFramesExecutedPromise);

        mockQ.verifyAll();
        sendMessageToFrameStrictMock.verifyAll();
    });

    test('SendMessageToFrame should not throw if window does not exist for frame', (done: () => void) => {
        const frameMessageRequest: MessageRequest<any> = {
            command: 'command1',
            frame: childFrameWithoutWindowInfo.frameElement,
            message: {},
        };

        mockQ
            .setup(x => x.timeout(It.isAny(), It.isAny()))
            .returns(Q.timeout)
            .verifiable(Times.once());

        testSubject.initialize();

        const promise = testSubject.sendMessage(frameMessageRequest);

        promise.then(null, () => {
            done();
        });
    });

    test("SendMessageToWindow should timeout if frame doesn't respond to ping", (done: () => void) => {
        const windowMessageRequest: MessageRequest<any> = {
            command: 'command1',
            win: childFrame1Info.window,
            message: {},
        };

        testSubject.initialize();

        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    FrameCommunicator.PingCommand,
                    null,
                    It.isAny(),
                    undefined,
                ),
            )
            .verifiable();

        const pingTimeoutDeferred = Q.defer();

        mockQ
            .setup(x => x.timeout(It.isAny(), 500))
            .returns((thePromise: Q.Promise<any>) => {
                expect(thePromise.isPending()).toBe(true);
                return pingTimeoutDeferred.promise;
            })
            .verifiable(Times.once());

        mockQ
            .setup(x => x.timeout(It.isAny(), FrameCommunicator.minWaitTimeForAllFrameResponse))
            .returns((thePromise: Q.Promise<any>, timeout) => {
                expect(thePromise.isPending()).toBe(true);
                return Q.timeout(thePromise, timeout);
            })
            .verifiable(Times.once());

        const promise = testSubject.sendMessage(windowMessageRequest);

        promise.then(null, () => {
            mockQ.verifyAll();
            mockWindowMessageHandler.verifyAll();
            done();
        });

        pingTimeoutDeferred.reject({});
    });

    test('SendMessageToFrame should rejected if frame is sandboxed', (done: () => void) => {
        const frameMessageRequest: MessageRequest<any> = {
            command: 'command1',
            frame: childFrame1Info.frameElement,
            message: {},
        };

        childFrame1Info.frameElement.setAttribute('sandbox', '');

        testSubject.initialize();

        // mock posting ping command
        mockWindowMessageHandler
            .setup(x => x.post(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());

        const promise = testSubject.sendMessage(frameMessageRequest);

        promise.then(null, () => {
            mockQ.verifyAll();
            mockWindowMessageHandler.verifyAll();
            done();
        });
    });

    test("SendMessageToWindow should timeout if frame doesn't respond to command", (done: () => void) => {
        const windowMessageRequest: MessageRequest<any> = {
            command: 'command1',
            win: childFrame1Info.window,
            message: {},
        };
        let pingCallback: Function;
        let pingDeferered: Q.Deferred<any>;
        let requestTimeoutDeferred: Q.Deferred<any>;

        testSubject.initialize();

        // mock posting ping command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    FrameCommunicator.PingCommand,
                    null,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                pingCallback = callback;
            })
            .verifiable();

        mockQ
            .setup(x => x.timeout(It.isAny(), 500))
            .returns((promise, timeout) => {
                pingDeferered = Q.defer();
                return pingDeferered.promise;
            })
            .verifiable(Times.once());

        // mock posting target command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    windowMessageRequest.command,
                    windowMessageRequest.message,
                    It.isAny(),
                    undefined,
                ),
            )
            .verifiable();

        // mock for the whole request timeout
        mockQ
            .setup(x => x.timeout(It.isAny(), FrameCommunicator.minWaitTimeForAllFrameResponse))
            .returns((promise: Q.Promise<any>, timeout) => {
                requestTimeoutDeferred = Q.defer();
                expect(promise.isPending()).toBe(true);

                return requestTimeoutDeferred.promise;
            })
            .verifiable(Times.once());

        const commandCompletepromise = testSubject.sendMessage(windowMessageRequest);

        pingDeferered.promise.then(() => {
            commandCompletepromise.then(null, () => {
                mockQ.verifyAll();
                mockWindowMessageHandler.verifyAll();
                done();
            });
        });

        expect(requestTimeoutDeferred.promise).toEqual(commandCompletepromise);

        pingCallback();
        pingDeferered.resolve({});
        requestTimeoutDeferred.reject({});
    });

    test('SendMessageToWindow should handle for error response of command from iframe', (done: () => void) => {
        const windowMessageRequest: MessageRequest<any> = {
            command: 'command1',
            win: childFrame1Info.window,
            message: {},
        };
        let pingCallback: Function;
        let pingDeferered: Q.Deferred<any>;
        const commandFailureMsg = new Error('error');
        let commandCallback: Function;

        testSubject.initialize();

        // mock posting ping command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    FrameCommunicator.PingCommand,
                    null,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                pingCallback = callback;
            })
            .verifiable();

        mockQ
            .setup(x => x.timeout(It.isAny(), 500))
            .returns(() => {
                pingDeferered = Q.defer();
                return pingDeferered.promise;
            })
            .verifiable(Times.once());

        mockQ
            .setup(x => x.timeout(It.isAny(), FrameCommunicator.minWaitTimeForAllFrameResponse))
            .returns(Q.timeout)
            .verifiable(Times.once());

        // mock posting target command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    windowMessageRequest.command,
                    windowMessageRequest.message,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                commandCallback = callback;
            })
            .verifiable(Times.once());

        const promise = testSubject.sendMessage(windowMessageRequest);

        pingDeferered.promise.then(() => {
            commandCallback(commandFailureMsg);

            promise.then(null, msg => {
                expect(commandFailureMsg).toEqual(msg);
                mockQ.verifyAll();
                mockWindowMessageHandler.verifyAll();
                done();
            });
        });

        pingCallback();
        pingDeferered.resolve({});
    });

    test('SendMessageToWindow should handle for success response of command from iframe', (done: () => void) => {
        const windowMessageRequest: MessageRequest<any> = {
            command: 'command1',
            win: childFrame1Info.window,
            message: {},
        };
        let pingCallback: Function;
        const commandMsg = {};
        let pingDeferered: Q.Deferred<any>;

        testSubject.initialize();

        // mock posting ping command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    FrameCommunicator.PingCommand,
                    null,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                pingCallback = callback;
            })
            .verifiable();

        mockQ
            .setup(x => x.timeout(It.isAny(), 500))
            .returns(() => {
                pingDeferered = Q.defer();
                return pingDeferered.promise;
            })
            .verifiable(Times.once());

        mockQ
            .setup(x => x.timeout(It.isAny(), FrameCommunicator.minWaitTimeForAllFrameResponse))
            .returns(Q.timeout)
            .verifiable(Times.once());

        let commandCallback: Function;

        // mock posting target command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    windowMessageRequest.command,
                    windowMessageRequest.message,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                commandCallback = callback;
            })
            .verifiable(Times.once());

        const promise = testSubject.sendMessage(windowMessageRequest);
        pingDeferered.promise.then(() => {
            commandCallback(commandMsg);

            promise.then(msg => {
                expect(commandMsg).toEqual(msg);
                mockQ.verifyAll();
                mockWindowMessageHandler.verifyAll();
                done();
            });
        });

        pingCallback();
        pingDeferered.resolve({});
    });

    test('SendMessageToFrame should handle sandboxed iframe with allow-scripts', (done: () => void) => {
        const frameMessageRequest: MessageRequest<any> = {
            command: 'command1',
            frame: childFrame1Info.frameElement,
            message: {},
        };

        childFrame1Info.frameElement.setAttribute(
            'sandbox',
            'allow-forms allow-scripts allow-same-origin',
        );

        let pingCallback: Function;
        const commandMsg = {};
        let pingDeferered: Q.Deferred<any>;

        testSubject.initialize();

        // mock posting ping command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    FrameCommunicator.PingCommand,
                    null,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                pingCallback = callback;
            })
            .verifiable();

        mockQ
            .setup(x => x.timeout(It.isAny(), 500))
            .returns(() => {
                pingDeferered = Q.defer();
                return pingDeferered.promise;
            })
            .verifiable(Times.once());

        mockQ
            .setup(x => x.timeout(It.isAny(), FrameCommunicator.minWaitTimeForAllFrameResponse))
            .returns(Q.timeout)
            .verifiable(Times.once());

        let commandCallback: Function;

        // mock posting target command
        mockWindowMessageHandler
            .setup(x =>
                x.post(
                    childFrame1Info.window,
                    frameMessageRequest.command,
                    frameMessageRequest.message,
                    It.isAny(),
                    undefined,
                ),
            )
            .callback((win, command, message, callback) => {
                commandCallback = callback;
            })
            .verifiable(Times.once());

        const promise = testSubject.sendMessage(frameMessageRequest);
        pingDeferered.promise.then(() => {
            commandCallback(commandMsg);

            promise.then(msg => {
                expect(commandMsg).toMatchObject(msg);
                mockQ.verifyAll();
                mockWindowMessageHandler.verifyAll();
                done();
            });
        });

        pingCallback();
        pingDeferered.resolve({});
    });

    function createFrameInfo(hasWindow: boolean): FrameInfo {
        const frameInfo: FrameInfo = {
            frameElement: document.createElement('iframe'),
            window: hasWindow ? ({} as Window) : null,
        };

        mockHtmlElementUtils
            .setup(x => x.getContentWindow(IsSameObject(frameInfo.frameElement)))
            .returns(() => frameInfo.window);

        return frameInfo;
    }

    function mockSendMessageToFrameCall(): IMock<
        (frameMessageRequest: MessageRequest<any>) => void
    > {
        const sendMessageToFrameStrictMock = Mock.ofInstance(
            testSubject.sendMessage,
            MockBehavior.Strict,
        );
        (testSubject.sendMessage as any) = sendMessageToFrameStrictMock.object;
        return sendMessageToFrameStrictMock;
    }

    function mockExecuteRequestForAllFrameRequestsCall(): IMock<
        (
            frameMessageRequests: MessageRequest<any>[],
            timeOut: number,
        ) => Q.IPromise<Q.PromiseState<FrameMessageResponseCallback>[]>
    > {
        const executeForAllFrameRequestsStrictMock = Mock.ofInstance(
            testSubject.executeRequestForAllFrameRequests,
            MockBehavior.Strict,
        );
        (testSubject.executeRequestForAllFrameRequests as any) = executeForAllFrameRequestsStrictMock.object;
        return executeForAllFrameRequestsStrictMock;
    }
});
