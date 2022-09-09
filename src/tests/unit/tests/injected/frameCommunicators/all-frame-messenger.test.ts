// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { Logger } from 'common/logging/logger';
import { mergePromiseResponses } from 'common/merge-promise-responses';
import { PromiseFactory, TimeoutCreator, TimeoutError } from 'common/promises/promise-factory';
import { AllFramesMessenger } from 'injected/frameCommunicators/all-frames-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
    PromiseWindowCommandMessageListener,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { SingleFrameMessenger } from 'injected/frameCommunicators/single-frame-messenger';
import { IMock, It, Mock, Times } from 'typemoq';

describe(AllFramesMessenger, () => {
    let singleFrameMessengerMock: IMock<SingleFrameMessenger>;
    let htmlUtilsMock: IMock<HTMLElementUtils>;
    let loggerMock: IMock<Logger>;
    let mergePromisesMock: IMock<typeof mergePromiseResponses>;
    let timeoutMock: IMock<TimeoutCreator>;
    let promiseFactoryStub: PromiseFactory;
    const iframeStubs = [{ id: 'iframe1' }, { id: 'iframe2' }] as HTMLIFrameElement[];
    const pingCommand = 'ping command';
    const pingTimeout = 10;
    const testCommand = 'test command';

    let testSubject: AllFramesMessenger;

    beforeEach(() => {
        singleFrameMessengerMock = Mock.ofType<SingleFrameMessenger>();
        htmlUtilsMock = Mock.ofType<HTMLElementUtils>();
        loggerMock = Mock.ofType<Logger>();
        mergePromisesMock = Mock.ofInstance(() => null);
        timeoutMock = Mock.ofInstance(() => null);

        promiseFactoryStub = {
            timeout: timeoutMock.object,
        } as PromiseFactory;

        testSubject = new AllFramesMessenger(
            singleFrameMessengerMock.object,
            htmlUtilsMock.object,
            promiseFactoryStub,
            loggerMock.object,
            mergePromisesMock.object,
            pingCommand,
            pingTimeout,
        );
    });

    afterEach(() => {
        singleFrameMessengerMock.verifyAll();
        htmlUtilsMock.verifyAll();
        loggerMock.verifyAll();
        mergePromisesMock.verifyAll();
        timeoutMock.verifyAll();
    });

    test('addMessageListener', () => {
        const listener = () => null;
        singleFrameMessengerMock
            .setup(f => f.addMessageListener(testCommand, listener))
            .verifiable();

        testSubject.addMessageListener(testCommand, listener);
    });

    test('sendMessageToWindow', async () => {
        const targetWindow = {} as Window;
        const message: CommandMessage = {
            command: testCommand,
        };
        singleFrameMessengerMock.setup(f => f.sendMessageToWindow(targetWindow, message));

        await testSubject.sendMessageToWindow(targetWindow, message);
    });

    test('constructor registers ping listener', async () => {
        singleFrameMessengerMock.reset();
        singleFrameMessengerMock
            .setup(f => f.addMessageListener(pingCommand, It.isAny()))
            .verifiable();

        testSubject = new AllFramesMessenger(
            singleFrameMessengerMock.object,
            htmlUtilsMock.object,
            promiseFactoryStub,
            loggerMock.object,
            mergePromisesMock.object,
            pingCommand,
            pingTimeout,
        );
    });

    test('Ping listener sends ping to all child frames', async () => {
        let pingListener: PromiseWindowCommandMessageListener;
        singleFrameMessengerMock.reset();
        singleFrameMessengerMock
            .setup(f => f.addMessageListener(pingCommand, It.isAny()))
            .returns((command, listener) => {
                pingListener = listener;
            })
            .verifiable();

        testSubject = new AllFramesMessenger(
            singleFrameMessengerMock.object,
            htmlUtilsMock.object,
            promiseFactoryStub,
            loggerMock.object,
            mergePromisesMock.object,
            pingCommand,
            pingTimeout,
        );

        setupPingFramesSuccessfully();

        await pingListener({ command: pingCommand }, {} as Window);
    });

    describe('initialize()', () => {
        test('pings all frames', async () => {
            setupPingFramesSuccessfully();

            await testSubject.initialize();
        });

        test('handles ping timeout', async () => {
            setupPingFramesWithOneTimeout(iframeStubs[0]);

            await testSubject.initialize();
        });

        test('throws if a non-timeout error is thrown', async () => {
            const testError = new Error('non-timeout error');

            htmlUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => iframeStubs as any)
                .verifiable(Times.once());

            timeoutMock
                .setup(t => t(It.isAny(), pingTimeout))
                .returns(async (promise, timeout) => {
                    await promise;
                })
                .verifiable(Times.exactly(iframeStubs.length));

            iframeStubs.forEach(frame => {
                singleFrameMessengerMock
                    .setup(m =>
                        m.sendMessageToFrame(frame, {
                            command: pingCommand,
                        }),
                    )
                    .returns(async () => {
                        throw testError;
                    })
                    .verifiable(Times.once());
            });

            await expect(testSubject.initialize()).rejects.toThrow(testError);
        });
    });

    describe('sendCommandToFrames', () => {
        test('throws if not initialized', async () => {
            await expect(testSubject.sendCommandToFrames(testCommand)).rejects.toThrow();
        });

        test('with no child iframes', async () => {
            htmlUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => [] as any)
                .verifiable(Times.once());
            mergePromisesMock.setup(m => m([])).returns(() => Promise.resolve());

            await testSubject.initialize();
            await testSubject.sendCommandToFrames(testCommand);
        });

        test('with all initial pings succeeded', async () => {
            setupPingFramesSuccessfully();
            iframeStubs.forEach(iframe => {
                singleFrameMessengerMock
                    .setup(f => f.sendMessageToFrame(iframe, { command: testCommand }))
                    .verifiable(Times.once());
            });
            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initialize();
            await testSubject.sendCommandToFrames(testCommand);
        });

        test('skips frames if ping fails', async () => {
            setupPingFramesWithOneTimeout(iframeStubs[0]);
            singleFrameMessengerMock
                .setup(f => f.sendMessageToFrame(iframeStubs[1], { command: testCommand }))
                .verifiable(Times.once());
            singleFrameMessengerMock
                .setup(f => f.sendMessageToFrame(iframeStubs[0], { command: testCommand }))
                .verifiable(Times.never());
            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initialize();
            await testSubject.sendCommandToFrames(testCommand);
        });

        test('only messages frames that responded to most recent ping', async () => {
            setupPingFramesSuccessfully();

            await testSubject.initialize();

            htmlUtilsMock.reset();
            timeoutMock.reset();
            singleFrameMessengerMock.reset();

            setupPingFramesWithOneTimeout(iframeStubs[0]);
            singleFrameMessengerMock
                .setup(f => f.sendMessageToFrame(iframeStubs[1], { command: testCommand }))
                .verifiable(Times.once());
            singleFrameMessengerMock
                .setup(f => f.sendMessageToFrame(iframeStubs[0], { command: testCommand }))
                .verifiable(Times.never());
            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initialize();
            await testSubject.sendCommandToFrames(testCommand);
        });
    });

    function setupPingFramesSuccessfully(): void {
        htmlUtilsMock
            .setup(m => m.getAllElementsByTagName('iframe'))
            .returns(() => iframeStubs as any)
            .verifiable(Times.once());

        timeoutMock
            .setup(t => t(It.isAny(), pingTimeout))
            .returns(async (promise, timeout) => {
                await promise;
            })
            .verifiable(Times.exactly(iframeStubs.length));

        iframeStubs.forEach(frame => {
            singleFrameMessengerMock
                .setup(m =>
                    m.sendMessageToFrame(frame, {
                        command: pingCommand,
                    }),
                )
                .verifiable(Times.once());
        });
    }

    function setupPingFramesWithOneTimeout(timeoutFrame: HTMLIFrameElement): void {
        htmlUtilsMock
            .setup(m => m.getAllElementsByTagName('iframe'))
            .returns(() => iframeStubs as any)
            .verifiable(Times.once());

        const timeoutPromise = Promise.resolve({
            payload: 'timeout payload',
        } as CommandMessageResponse);
        timeoutMock
            .setup(t => t(It.isAny(), pingTimeout))
            .returns(async (promise, timeout) => {
                if (promise === timeoutPromise) {
                    throw new TimeoutError('test timeout');
                } else {
                    await promise;
                }
            })
            .verifiable(Times.exactly(iframeStubs.length));

        iframeStubs.forEach(frame => {
            singleFrameMessengerMock
                .setup(m =>
                    m.sendMessageToFrame(frame, {
                        command: pingCommand,
                    }),
                )
                .returns((frame, message) => {
                    if (frame.id === timeoutFrame.id) {
                        return timeoutPromise;
                    } else {
                        return Promise.resolve({ payload: null });
                    }
                })
                .verifiable(Times.once());
        });

        loggerMock.setup(l => l.error(It.isAny())).verifiable();
    }
});
