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
    const iframeStubs = [
        { id: 'iframe1' },
        { id: 'iframe2' },
        { id: 'iframe3' },
    ] as HTMLIFrameElement[];
    const pingCommand = 'ping command';
    const pingTimeout = 10;
    const testCommand = 'test command';
    const pingResponse = {
        payload: {
            status: 'ready',
        },
    };

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

            await testSubject.initializeAllFrames();
        });

        test('handles ping timeout', async () => {
            setupPingFramesWithOneTimeout(iframeStubs[0]);

            await testSubject.initializeAllFrames();
        });

        test('throws if a non-timeout error is thrown', async () => {
            const testError = new Error('non-timeout error');

            htmlUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => iframeStubs as any)
                .verifiable(Times.once());

            timeoutMock
                .setup(t => t(It.isAny(), pingTimeout))
                .returns(async (promise, timeout) => promise)
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

            await expect(testSubject.initializeAllFrames()).rejects.toThrow();
        });

        test('throws if ping returns an unexpected response', async () => {
            htmlUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => iframeStubs as any)
                .verifiable(Times.once());

            timeoutMock
                .setup(t => t(It.isAny(), pingTimeout))
                .returns(async (promise, timeout) => promise)
                .verifiable(Times.exactly(iframeStubs.length));

            iframeStubs.forEach(frame => {
                singleFrameMessengerMock
                    .setup(m =>
                        m.sendMessageToFrame(frame, {
                            command: pingCommand,
                        }),
                    )
                    .returns(async () => ({ payload: 'some unexpected payload' }))
                    .verifiable(Times.once());
            });

            await expect(testSubject.initializeAllFrames()).rejects.toThrow();
        });
    });

    describe('sendCommandToAllFrames', () => {
        test('throws if not initialized', async () => {
            await expect(testSubject.sendCommandToAllFrames(testCommand)).rejects.toThrow();
        });

        test('with no child iframes', async () => {
            htmlUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => [] as any)
                .verifiable(Times.once());
            mergePromisesMock.setup(m => m([])).returns(() => Promise.resolve());

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToAllFrames(testCommand);
        });

        test.each([undefined, {}])(
            'with all initial pings succeeded and payload=%s',
            async payload => {
                setupPingFramesSuccessfully();
                iframeStubs.forEach(iframe => setupSendTestCommandToFrame(iframe, payload));
                mergePromisesMock
                    .setup(m => m(It.isAny()))
                    .returns(async promises => {
                        await Promise.all(promises);
                    })
                    .verifiable();

                await testSubject.initializeAllFrames();
                await testSubject.sendCommandToAllFrames(testCommand, payload);
            },
        );

        test('skips frames if ping fails', async () => {
            setupPingFramesWithOneTimeout(iframeStubs[0]);

            setupNeverSendTestCommandToFrame(iframeStubs[0]);
            setupSendTestCommandToFrame(iframeStubs[1]);
            setupSendTestCommandToFrame(iframeStubs[2]);

            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToAllFrames(testCommand);
        });

        test('only messages frames that responded to most recent ping', async () => {
            setupPingFramesSuccessfully();

            await testSubject.initializeAllFrames();

            htmlUtilsMock.reset();
            timeoutMock.reset();
            singleFrameMessengerMock.reset();

            setupPingFramesWithOneTimeout(iframeStubs[0]);

            setupNeverSendTestCommandToFrame(iframeStubs[0]);
            setupSendTestCommandToFrame(iframeStubs[1]);
            setupSendTestCommandToFrame(iframeStubs[2]);

            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToAllFrames(testCommand);
        });
    });

    describe('sendCommandToMultipleFrames', () => {
        test('throws if not initialized', async () => {
            await expect(
                testSubject.sendCommandToMultipleFrames(testCommand, iframeStubs),
            ).rejects.toThrow();
        });

        test('with empty iframe list', async () => {
            setupPingFramesSuccessfully();

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToMultipleFrames(testCommand, []);
        });

        test('Skips frames that did not respond to ping', async () => {
            setupPingFramesWithOneTimeout(iframeStubs[0]);

            setupNeverSendTestCommandToFrame(iframeStubs[0]);
            setupSendTestCommandToFrame(iframeStubs[1]);
            setupSendTestCommandToFrame(iframeStubs[2]);

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToMultipleFrames(testCommand, iframeStubs);
        });

        test('Only messages frames in list', async () => {
            setupPingFramesSuccessfully();

            setupSendTestCommandToFrame(iframeStubs[0]);
            setupNeverSendTestCommandToFrame(iframeStubs[1]);
            setupNeverSendTestCommandToFrame(iframeStubs[2]);

            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToMultipleFrames(testCommand, [iframeStubs[0]]);
        });

        test('with payload', async () => {
            const payload = { value: 'test payload' };
            const getPayloadMock = jest.fn(() => payload);

            setupPingFramesSuccessfully();
            iframeStubs.forEach(iframe => setupSendTestCommandToFrame(iframe, payload));

            mergePromisesMock
                .setup(m => m(It.isAny()))
                .returns(async promises => {
                    await Promise.all(promises);
                })
                .verifiable();

            await testSubject.initializeAllFrames();
            await testSubject.sendCommandToMultipleFrames(testCommand, iframeStubs, getPayloadMock);

            expect(getPayloadMock).toHaveBeenCalledWith(iframeStubs[0], 0);
            expect(getPayloadMock).toHaveBeenCalledWith(iframeStubs[1], 1);
            expect(getPayloadMock).toHaveBeenCalledWith(iframeStubs[2], 2);
        });
    });

    function setupPingFramesSuccessfully(): void {
        htmlUtilsMock
            .setup(m => m.getAllElementsByTagName('iframe'))
            .returns(() => iframeStubs as any)
            .verifiable(Times.once());

        timeoutMock
            .setup(t => t(It.isAny(), pingTimeout))
            .returns((promise, timeout) => promise)
            .verifiable(Times.exactly(iframeStubs.length));

        iframeStubs.forEach(frame => {
            singleFrameMessengerMock
                .setup(m =>
                    m.sendMessageToFrame(frame, {
                        command: pingCommand,
                    }),
                )
                .returns(async () => pingResponse)
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
                    return promise;
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
                        return Promise.resolve(pingResponse);
                    }
                })
                .verifiable(Times.once());
        });

        loggerMock.setup(l => l.error(It.isAny(), It.isAny())).verifiable();
    }

    function setupSendTestCommandToFrame(iframe: HTMLIFrameElement, payload?: any): void {
        singleFrameMessengerMock
            .setup(m =>
                m.sendMessageToFrame(iframe, {
                    command: testCommand,
                    payload,
                }),
            )
            .verifiable(Times.once());
    }

    function setupNeverSendTestCommandToFrame(iframe: HTMLIFrameElement, payload?: any): void {
        singleFrameMessengerMock
            .setup(m =>
                m.sendMessageToFrame(iframe, {
                    command: testCommand,
                    payload,
                }),
            )
            .verifiable(Times.never());
    }
});
