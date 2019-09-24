// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { IndexedDBDataKeys } from '../../../../background/IndexedDBDataKeys';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import { Logger } from '../../../../common/logging/logger';
import { ElectronStorageAdapter } from '../../../../electron/adapters/electron-storage-adapter';

describe('ElectronStorageAdapter', () => {
    let electronStorageAdapter: ElectronStorageAdapter;
    let indexedDBInstanceMock: IMock<IndexedDBAPI>;
    let loggerInstanceMock: IMock<Logger>;

    indexedDBInstanceMock = Mock.ofType<IndexedDBAPI>();
    loggerInstanceMock = Mock.ofType<Logger>();

    afterEach(() => {
        indexedDBInstanceMock.reset();
        loggerInstanceMock.reset();
    });

    // it('sets user data with input items', () => {
    //     const expectedData = {
    //         testKey1: 'test-value-1',
    //         testKey2: 'test-value-2',
    //     };

    //     function someCallBack(): string {
    //         return 'someFunc was called';
    //     }

    //     indexedDBInstanceMock
    //         .setup(async indexedDB => await indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(expectedData)))
    //         .returns(() => Promise.resolve(true))
    //         .verifiable(Times.once());

    //     loggerInstanceMock.verify(logger => logger.error(It.isAny()), Times.never());

    //     electronStorageAdapter.setUserData(expectedData);

    //     indexedDBInstanceMock.verifyAll();
    //     loggerInstanceMock.verifyAll();
    // });

    it('throws and catches error when an error has occurred', async () => {
        const expectedData = {
            testKey1: 'test-value-1',
            testKey2: 'test-value-2',
        };

        indexedDBInstanceMock
            .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(expectedData)))
            .returns(() => new Promise((re, rj) => rj('test-error')))
            .verifiable(Times.once());

        loggerInstanceMock.setup(logger => logger.error(It.isAny())).verifiable(Times.once());

        electronStorageAdapter = new ElectronStorageAdapter(indexedDBInstanceMock.object, loggerInstanceMock.object);

        electronStorageAdapter.setUserData(expectedData);

        indexedDBInstanceMock.verifyAll();
        loggerInstanceMock.verifyAll();
    });

    // describe('getUserData', () => {
    //     it('gets user data using input keys', () => {
    //         // TODO
    //     });

    //     it('throws and catches error when an error has occurred', () => {
    //         // TODO
    //     });
    // });

    // describe('removeUserData', () => {
    //     it('removes user data based on input key', () => {
    //         // TODO
    //     });

    //     it('throws and catches error when an error has occurred', () => {
    //         // TODO
    //     });
    // });
});
