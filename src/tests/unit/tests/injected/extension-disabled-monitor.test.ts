// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Messages } from 'common/messages';
import { ExtensionDisabledMonitor } from 'injected/extension-disabled-monitor';
import { RecordingLogger } from 'tests/unit/common/recording-logger';
import { TimeSimulatingPromiseFactory } from 'tests/unit/common/time-simulating-promise-factory';
import { IMock, Mock, Times } from 'typemoq';

describe(ExtensionDisabledMonitor, () => {
    let testSubject: ExtensionDisabledMonitor;
    let recordingLogger: RecordingLogger;
    let promiseFactory: TimeSimulatingPromiseFactory;
    let mockBrowserAdapter: IMock<BrowserAdapter>;

    const expectedPingMessage = { messageType: Messages.Common.Ping };

    beforeEach(() => {
        recordingLogger = new RecordingLogger();
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();
        promiseFactory = new TimeSimulatingPromiseFactory();

        testSubject = new ExtensionDisabledMonitor(
            mockBrowserAdapter.object,
            promiseFactory,
            recordingLogger,
        );
    });

    it('invokes onDisabledCallback immediately if initialized while already disabled', async () => {
        const onDisabledCallback = jest.fn();
        mockBrowserAdapter
            .setup(m => m.sendRuntimeMessage(expectedPingMessage))
            .throws(new Error('extension context is torn down'))
            .verifiable(Times.once());

        await testSubject.monitorUntilDisabled(onDisabledCallback);

        mockBrowserAdapter.verifyAll();
        expect(recordingLogger.allMessages).toStrictEqual(['Detected extension disablement']);
        expect(promiseFactory.elapsedTime).toBe(0);
    });

    it('invokes onDisabledCallback once the background fails to respond', async () => {
        const onDisabledCallback = jest.fn();
        let sentMessages = 0;
        mockBrowserAdapter
            .setup(m => m.sendRuntimeMessage(expectedPingMessage))
            .returns(() => {
                sentMessages++;
                if (sentMessages < 3) {
                    return Promise.resolve('pong');
                } else {
                    throw new Error('lost connection to extension context');
                }
            })
            .verifiable(Times.exactly(3));

        await testSubject.monitorUntilDisabled(onDisabledCallback);

        mockBrowserAdapter.verifyAll();
        expect(recordingLogger.allMessages).toStrictEqual(['Detected extension disablement']);
        expect(onDisabledCallback).toHaveBeenCalledTimes(1);
        expect(promiseFactory.elapsedTime).toBe(2 * 1000);
    });
});
