import { USAGE_KEY, UsageLogger } from 'background/usage-logger';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { Logger } from 'common/logging/logger';
import { It, Mock, MockBehavior, Times, IMock } from 'typemoq';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
describe('UsageLoggerTest', () => {
    let storageAdapterMock: IMock<StorageAdapter>;
    let dateGetterMock: IMock<() => Date>;
    let loggerMock: IMock<Logger>;

    const dateStub = { toISOString: () => 'time' } as Date;
    const expected = {
        usageData: {
            lastUsageDateTime: 'time',
            magic: USAGE_KEY,
        },
    };

    beforeEach(() => {
        storageAdapterMock = Mock.ofType<StorageAdapter>(undefined, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>(undefined, MockBehavior.Strict);
        dateGetterMock = Mock.ofInstance(() => dateStub, MockBehavior.Strict);
        dateGetterMock.setup(m => m()).returns(_ => dateStub);
    });
    /*
    it('sets current time', () => {
        const usageLogger = new UsageLogger(
            storageAdapterMock.object,
            dateGetterMock.object,
            loggerMock.object,
        );

        storageAdapterMock
            .setup(m => m.setUserData(It.isValue(expected)))
            .returns(_ => Promise.resolve());

        loggerMock.setup(l => l.error()).verifiable(Times.never());

        usageLogger.record();

        storageAdapterMock.verifyAll();
        loggerMock.verifyAll();
    });

    it('routes to logger if promise rejected', () => {
        const usageLogger = new UsageLogger(
            storageAdapterMock.object,
            dateGetterMock.object,
            loggerMock.object,
        );

        storageAdapterMock
            .setup(m => m.setUserData(It.isValue(expected)))
            .returns(_ => Promise.reject());

        loggerMock.setup(l => l.error()).verifiable(Times.once());

        usageLogger.record();

        storageAdapterMock.verifyAll();
        loggerMock.verifyAll();
    });*/
});
