// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { OnDevToolStatusPayload } from 'background/actions/action-payloads';
import { DevToolsMonitor } from 'background/dev-tools-monitor';
import { TabContextManager } from 'background/tab-context-manager';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Messages } from 'common/messages';
import {
    DelayCreator,
    PromiseFactory,
    TimeoutCreator,
    TimeoutError,
} from 'common/promises/promise-factory';
import { isEqual, max } from 'lodash';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryNumberTo } from 'types/common-types';

class TestDevToolsMonitor extends DevToolsMonitor {
    public activeDevtoolTabIds: number[];

    public async testPollLoop(): Promise<void> {
        await super.monitorActiveDevtools();
    }
}

describe(DevToolsMonitor, () => {
    const messageTimeout = 10;
    const pollInterval = 20;
    const tabId = 1;
    const anotherTabId = 10;

    const messageSuccessResponse = { isActive: true };
    const mockTimeoutResponse = { isTimeout: true };

    let browserAdapterMock: IMock<BrowserAdapter>;
    let timeoutMock: IMock<TimeoutCreator>;
    let delayMock: IMock<DelayCreator>;
    let promiseFactory: PromiseFactory;
    let tabContextManagerMock: IMock<TabContextManager>;

    let testSubject: TestDevToolsMonitor;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        timeoutMock = Mock.ofType<TimeoutCreator>();
        delayMock = Mock.ofType<DelayCreator>();
        promiseFactory = {
            timeout: timeoutMock.object,
            delay: delayMock.object,
        } as PromiseFactory;
        tabContextManagerMock = Mock.ofType<TabContextManager>();

        testSubject = new TestDevToolsMonitor(
            browserAdapterMock.object,
            promiseFactory,
            [],
            tabContextManagerMock.object,
            messageTimeout,
            pollInterval,
        );
    });

    afterEach(() => {
        browserAdapterMock.verifyAll();
        timeoutMock.verifyAll();
        delayMock.verifyAll();
        tabContextManagerMock.verifyAll();
    });

    it.each([1, 3])(
        'Start poll loop and run %s times when first devtool tab id is added',
        async pollCount => {
            const tabPollCounts: DictionaryNumberTo<number> = {};
            tabPollCounts[tabId] = pollCount;

            setupPollLoop(tabPollCounts);

            testSubject.startMonitoringDevtool(tabId);

            await flushSettledPromises();
        },
    );

    it('Does not start poll loop if another devtool is already being monitored', async () => {
        testSubject.activeDevtoolTabIds = [anotherTabId];

        timeoutMock.setup(t => t(It.isAny(), It.isAny())).verifiable(Times.never());
        delayMock.setup(d => d(It.isAny(), It.isAny())).verifiable(Times.never());
        browserAdapterMock.setup(b => b.sendRuntimeMessage(It.isAny())).verifiable(Times.never());

        testSubject.startMonitoringDevtool(tabId);

        await flushSettledPromises();

        expect(testSubject.activeDevtoolTabIds).toContain(tabId);
    });

    it('Polls two devtool tabs until both have closed', async () => {
        testSubject.activeDevtoolTabIds = [tabId, anotherTabId];

        const tabPollCounts: DictionaryNumberTo<number> = {};
        tabPollCounts[tabId] = 2;
        tabPollCounts[anotherTabId] = 4;

        setupPollLoop(tabPollCounts);

        await testSubject.testPollLoop();
    });

    it('Add a devtool tab while monitor loop is running asynchronously', async () => {
        let firstIteration = true;
        let stopLoop = false;

        setupDelayCreator(Times.atLeastOnce());
        setupTimeoutCreator(Times.atLeastOnce());

        browserAdapterMock
            .setup(b => b.sendRuntimeMessage(It.isAny()))
            .returns(async message => {
                // During the first loop, add another tabId to monitor
                if (firstIteration) {
                    firstIteration = false;
                    testSubject.startMonitoringDevtool(anotherTabId);
                }
                // stop the loop on the next iteration after the second tab has been messaged
                if (!stopLoop && message.tabId === anotherTabId) {
                    stopLoop = true;
                } else if (stopLoop) {
                    return mockTimeoutResponse;
                }
                return messageSuccessResponse;
            })
            .verifiable(Times.atLeastOnce());

        setupDevtoolClosed(tabId);
        setupDevtoolClosed(anotherTabId);

        testSubject.startMonitoringDevtool(tabId);

        await flushSettledPromises();

        browserAdapterMock.verify(
            b => b.sendRuntimeMessage(It.isObjectWith({ tabId: tabId })),
            Times.atLeastOnce(),
        );
        browserAdapterMock.verify(
            b => b.sendRuntimeMessage(It.isObjectWith({ tabId: anotherTabId })),
            Times.atLeastOnce(),
        );
    });

    it("Handles 'Could not establish connection' error on message", async () => {
        const testError = new Error(
            'Error: Could not establish connection. Receiving end does not exist.',
        );
        browserAdapterMock
            .setup(b =>
                b.sendRuntimeMessage({ messageType: Messages.DevTools.StatusRequest, tabId }),
            )
            .throws(testError);
        setupTimeoutCreator(Times.never()); // mock call is not verified if return hook throws
        setupDelayCreator(Times.once());
        setupDevtoolClosed(tabId);

        testSubject.activeDevtoolTabIds = [tabId];

        await testSubject.testPollLoop();
    });

    it('Throws in loop if a non timeout error occurs', async () => {
        const testError = new Error('Non-timeout error');
        browserAdapterMock
            .setup(b =>
                b.sendRuntimeMessage({ messageType: Messages.DevTools.StatusRequest, tabId }),
            )
            .throws(testError);
        setupTimeoutCreator(Times.never()); // mock call is not verified if return hook throws
        setupDelayCreator(Times.once());

        testSubject.activeDevtoolTabIds = [tabId];

        await expect(testSubject.testPollLoop()).rejects.toThrow(testError);
    });

    function setupPollLoop(expectedTabPollCounts: DictionaryNumberTo<number>): void {
        let totalMessageCount = 0;
        let totalLoopCount = 0;

        Object.keys(expectedTabPollCounts).forEach(pollTabId => {
            const tabPollCount: number = expectedTabPollCounts[pollTabId];
            totalMessageCount += tabPollCount;
            totalLoopCount = max([totalLoopCount, tabPollCount]);

            setupPollTabTimes(parseInt(pollTabId), tabPollCount);
        });

        setupDelayCreator(Times.exactly(totalLoopCount));
        setupTimeoutCreator(Times.exactly(totalMessageCount));
    }

    function setupPollTabTimes(pollTabId: number, times: number): void {
        let tabPollCount = 0;
        const expectedMessage = {
            messageType: Messages.DevTools.StatusRequest,
            tabId: pollTabId,
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

        setupDevtoolClosed(pollTabId);
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

    function setupDelayCreator(times: Times): void {
        delayMock.setup(d => d(It.isAny(), pollInterval)).verifiable(times);
    }

    function setupDevtoolClosed(tabId): void {
        tabContextManagerMock
            .setup(t =>
                t.interpretMessageForTab(tabId, {
                    payload: {
                        status: false,
                    } as OnDevToolStatusPayload,
                    tabId: tabId,
                    messageType: Messages.DevTools.DevtoolStatus,
                }),
            )
            .verifiable();
    }
});
