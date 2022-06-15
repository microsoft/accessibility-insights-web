// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ExtensionDisabledMonitor } from 'injected/extension-disabled-monitor';
import { RecordingLogger } from 'tests/unit/common/recording-logger';
import { TimeSimulatingPromiseFactory } from 'tests/unit/common/time-simulating-promise-factory';
import { IMock, Mock, Times } from 'typemoq';

describe(ExtensionDisabledMonitor, () => {
    let testSubject: ExtensionDisabledMonitor;
    let recordingLogger: RecordingLogger;
    let promiseFactory: TimeSimulatingPromiseFactory;
    let mockBrowserAdapter: IMock<BrowserAdapter>;

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

    it('invokes onDisabledCallback once the browser declines telling us our id', async () => {
        const onDisabledCallback = jest.fn();
        let idQueryCount = 0;
        mockBrowserAdapter
            .setup(m => m.getExtensionId())
            .returns(() => {
                idQueryCount++;
                return idQueryCount < 3 ? 'some-id' : undefined;
            })
            .verifiable(Times.exactly(3));

        await testSubject.monitorUntilDisabled(onDisabledCallback);

        mockBrowserAdapter.verifyAll();
        expect(recordingLogger.allMessages).toStrictEqual(['Detected extension disablement']);
        expect(onDisabledCallback).toHaveBeenCalledTimes(1);
        expect(promiseFactory.elapsedTime).toBe(2 * 1000);
    });

    it('invokes onDisabledCallback immediately if initialized while already disabled', async () => {
        const onDisabledCallback = jest.fn();
        mockBrowserAdapter
            .setup(m => m.getExtensionId())
            .returns(() => undefined)
            .verifiable(Times.once());

        await testSubject.monitorUntilDisabled(onDisabledCallback);

        mockBrowserAdapter.verifyAll();
        expect(recordingLogger.allMessages).toStrictEqual(['Detected extension disablement']);
        expect(promiseFactory.elapsedTime).toBe(0);
    });
});
