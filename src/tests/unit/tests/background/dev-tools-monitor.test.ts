// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DevToolActions } from 'background/actions/dev-tools-actions';
import { DevToolsMonitor } from 'background/dev-tools-monitor';
import { Interpreter } from 'background/interpreter';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { AsyncAction } from 'common/flux/async-action';
import { Messages } from 'common/messages';
import {
    DelayCreator,
    PromiseFactory,
    TimeoutCreator,
    TimeoutError,
} from 'common/promises/promise-factory';
import { isEqual } from 'lodash';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { IMock, It, Mock, Times } from 'typemoq';

class TestDevToolsMonitor extends DevToolsMonitor {
    public async testPollLoop(): Promise<void> {
        await super.pollUntilClosed();
    }
}

describe(DevToolsMonitor, () => {
    const messageTimeout = 10;
    const pollInterval = 20;
    const tabId = 1;

    const messageSuccessResponse = { isActive: true };
    const mockTimeoutResponse = { isTimeout: true };

    let browserAdapterMock: IMock<BrowserAdapter>;
    let timeoutMock: IMock<TimeoutCreator>;
    let delayMock: IMock<DelayCreator>;
    let promiseFactory: PromiseFactory;
    let interpreterMock: IMock<Interpreter>;

    let setDevToolStateActionMock: IMock<AsyncAction<boolean>>;
    let onStateChanged: (status: boolean) => void;

    let testSubject: TestDevToolsMonitor;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        timeoutMock = Mock.ofType<TimeoutCreator>();
        delayMock = Mock.ofType<DelayCreator>();
        promiseFactory = {
            timeout: timeoutMock.object,
            delay: delayMock.object,
        } as PromiseFactory;
        interpreterMock = Mock.ofType<Interpreter>();

        setDevToolStateActionMock = Mock.ofType<AsyncAction<boolean>>();
        setDevToolStateActionMock
            .setup(s => s.addListener(It.isAny()))
            .returns(listener => (onStateChanged = listener))
            .verifiable(Times.once());

        testSubject = new TestDevToolsMonitor(
            tabId,
            browserAdapterMock.object,
            promiseFactory,
            interpreterMock.object,
            {
                setDevToolState: setDevToolStateActionMock.object,
            } as DevToolActions,
            messageTimeout,
            pollInterval,
            1,
        );
    });

    afterEach(() => {
        browserAdapterMock.verifyAll();
        timeoutMock.verifyAll();
        delayMock.verifyAll();
        interpreterMock.verifyAll();
        setDevToolStateActionMock.verifyAll();
    });

    it.each([1, 3])(
        'initialize registers action listener, starts polling loop, and polls %s times until devtool closes',
        async pollTimes => {
            setupPollTabTimes(pollTimes);

            testSubject.initialize();

            await flushSettledPromises();
        },
    );

    it('onDevtoolStateChanged listener does nothing if status=false', async () => {
        await initializeWithoutActiveDevtool();

        browserAdapterMock.setup(b => b.sendRuntimeMessage(It.isAny())).verifiable(Times.never());
        timeoutMock.setup(t => t(It.isAny(), It.isAny())).verifiable(Times.never());
        delayMock.setup(d => d(It.isAny(), It.isAny())).verifiable(Times.never());
        interpreterMock.setup(i => i.interpret(It.isAny())).verifiable(Times.never());

        onStateChanged(false);

        await flushSettledPromises();
    });

    it('onDevtoolStateChanged listener starts monitor if status = true', async () => {
        await initializeWithoutActiveDevtool();

        setupPollTabTimes(2);

        onStateChanged(true);

        await flushSettledPromises();
    });

    it('onDevtoolStateChanged does not restart monitor if it has been started by initialize()', async () => {
        setupPollTabTimes(3, () => onStateChanged(true));

        testSubject.initialize();

        await flushSettledPromises();
    });

    it('onDevtoolStateChanged does not restart monitor if it has been started by action listener', async () => {
        await initializeWithoutActiveDevtool();

        setupPollTabTimes(3, () => onStateChanged(true));

        onStateChanged(true);

        await flushSettledPromises();
    });

    it("Handles 'Could not establish connection' error", async () => {
        setDevToolStateActionMock.reset();

        const testError = new Error(
            'Error: Could not establish connection. Receiving end does not exist.',
        );
        browserAdapterMock
            .setup(b =>
                b.sendRuntimeMessage({ messageType: Messages.DevTools.StatusRequest, tabId }),
            )
            .throws(testError);
        setupTimeoutCreator(Times.never()); // mock call is not verified if return hook throws
        setupDelayCreator(Times.never());
        setupDevtoolClosed();

        await testSubject.testPollLoop();
    });

    it('Throws and stops polling loop if a non timeout error occurs', async () => {
        setDevToolStateActionMock.reset();

        const testError = new Error('Non-timeout error');
        browserAdapterMock
            .setup(b =>
                b.sendRuntimeMessage({ messageType: Messages.DevTools.StatusRequest, tabId }),
            )
            .throws(testError);
        setupTimeoutCreator(Times.never()); // mock call is not verified if return hook throws
        setupDelayCreator(Times.never());
        setupDevtoolClosed(Times.never());

        await expect(testSubject.testPollLoop()).rejects.toThrow(testError);
    });

    it('Only stops monitoring after maxFailedPings failures', async () => {
        const maxFailedPings = 3;
        let tabPollCount = 0;
        testSubject = new TestDevToolsMonitor(
            tabId,
            browserAdapterMock.object,
            promiseFactory,
            interpreterMock.object,
            {
                setDevToolState: setDevToolStateActionMock.object,
            } as DevToolActions,
            messageTimeout,
            pollInterval,
            maxFailedPings,
        );

        const expectedMessage = {
            messageType: Messages.DevTools.StatusRequest,
            tabId: tabId,
        };

        browserAdapterMock
            .setup(b => b.sendRuntimeMessage(expectedMessage))
            .returns(async () => {
                tabPollCount += 1;
                // Let the second ping succeed to
                // make sure the failure count resets
                if (tabPollCount === 2) {
                    return messageSuccessResponse;
                } else {
                    return mockTimeoutResponse;
                }
            })
            .verifiable(Times.exactly(maxFailedPings + 2));

        setupTimeoutCreator(Times.exactly(maxFailedPings + 2));
        setupDelayCreator(Times.exactly(maxFailedPings + 1));
        setupDevtoolClosed();

        testSubject.initialize();

        await flushSettledPromises();
    });

    function setupPollTabTimes(times: number, delayCallback?: () => void): void {
        let tabPollCount = 0;
        const expectedMessage = {
            messageType: Messages.DevTools.StatusRequest,
            tabId: tabId,
        };

        browserAdapterMock
            .setup(b => b.sendRuntimeMessage(expectedMessage))
            .returns(async message => {
                tabPollCount += 1;
                if (tabPollCount < times) {
                    return messageSuccessResponse;
                } else {
                    return mockTimeoutResponse;
                }
            })
            .verifiable(Times.exactly(times));

        setupTimeoutCreator(Times.exactly(times));
        setupDelayCreator(Times.exactly(times - 1), delayCallback);
        setupDevtoolClosed();
    }

    async function initializeWithoutActiveDevtool(): Promise<void> {
        setupPollTabTimes(1);

        testSubject.initialize();

        await flushSettledPromises();

        browserAdapterMock.reset();
        timeoutMock.reset();
        delayMock.reset();
        interpreterMock.reset();
    }

    function setupTimeoutCreator(times: Times): void {
        timeoutMock
            .setup(t => t(It.isAny(), messageTimeout))
            .returns(async (promise, timeout) => {
                const result = await promise;
                if (isEqual(result, mockTimeoutResponse)) {
                    return Promise.reject(new TimeoutError('Test timeout error'));
                }
                return result;
            })
            .verifiable(times);
    }

    function setupDelayCreator(times: Times, callback?: () => void): void {
        delayMock
            .setup(d => d(It.isAny(), pollInterval))
            .returns(async () => {
                if (callback) {
                    callback();
                }
            })
            .verifiable(times);
    }

    function setupDevtoolClosed(times?: Times): void {
        interpreterMock
            .setup(i =>
                i.interpret({
                    tabId: tabId,
                    messageType: Messages.DevTools.Closed,
                }),
            )
            .returns(() => ({ messageHandled: true, result: undefined }))
            .verifiable(times ?? Times.once());
    }
});
