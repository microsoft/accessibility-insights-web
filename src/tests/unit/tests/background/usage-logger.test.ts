import { USAGE_KEY, UsageLogger } from 'background/usage-logger';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { Logger } from 'common/logging/logger';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

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
            usageKey: USAGE_KEY,
        },
    };

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();
        storageAdapterMock = Mock.ofType<StorageAdapter>(undefined, MockBehavior.Strict);
        dateGetterMock = Mock.ofInstance(() => dateStub, MockBehavior.Strict);
        dateGetterMock.setup(m => m()).returns(_ => dateStub);
    });

    it('sets current time', () => {
        const usageLogger = new UsageLogger(
            storageAdapterMock.object,
            dateGetterMock.object,
            loggerMock.object,
        );

        storageAdapterMock
            .setup(m => m.setUserData(It.isValue(expected)))
            .returns(_ => Promise.resolve());

        usageLogger.record();

        storageAdapterMock.verifyAll();
    });

    it('routes to logger if promise rejected', () => {
        const errorMessage = 'errorMessage';
        const usageLogger = new UsageLogger(
            storageAdapterMock.object,
            dateGetterMock.object,
            loggerMock.object,
        );

        storageAdapterMock
            .setup(m => m.setUserData(It.isValue(expected)))
            .returns(_ => Promise.reject({ message: errorMessage }));

        usageLogger.record();

        storageAdapterMock.verifyAll();
        loggerMock.verify(l => l.error(errorMessage), Times.once());
    });
});
