// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { IndexedDBDataKeys } from '../../../../background/IndexedDBDataKeys';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import { Logger } from '../../../../common/logging/logger';
import { ElectronStorageAdapter } from '../../../../electron/adapters/electron-storage-adapter';

describe('ElectronStorageAdapter', () => {
    let electronStorageAdapter: ElectronStorageAdapter;
    let indexedDBInstanceMock: IMock<IndexedDBAPI>;
    let loggerInstanceMock: IMock<Logger>;

    beforeEach(() => {
        indexedDBInstanceMock = Mock.ofType<IndexedDBAPI>();
        loggerInstanceMock = Mock.ofType<Logger>();
        electronStorageAdapter = new ElectronStorageAdapter(indexedDBInstanceMock.object, loggerInstanceMock.object);
    });

    describe('setUserData', () => {
        it('sets user data with input items', async () => {
            const expectedData = {
                testKey1: 'test-value-1',
                testKey2: 'test-value-2',
            };

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, expectedData))
                .returns(() => new Promise(resolve => resolve(true)))
                .verifiable(Times.once());

            loggerInstanceMock.verify(logger => logger.log(It.isAny()), Times.never());

            electronStorageAdapter.setUserData(expectedData);
            indexedDBInstanceMock.verifyAll();
        });

        it('throws and catches error when an error has occurred', () => {
            const expectedData = {
                testKey1: 'test-value-1',
                testKey2: 'test-value-2',
            };

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, expectedData))
                .returns(() => new Promise((resolve, reject) => reject('test-error')))
                .verifiable(Times.once());

            electronStorageAdapter.setUserData(expectedData);

            loggerInstanceMock
                .setup(logger => logger.error('Error occurred when trying to set user data: test-error'))
                .verifiable(Times.once());

            indexedDBInstanceMock.verifyAll();
            loggerInstanceMock.verifyAll();
        });
    });

    describe('getUserData', () => {
        it('gets user data using input keys', () => {
            // TODO
        });

        it('throws and catches error when an error has occurred', () => {
            // TODO
        });
    });

    describe('removeUserData', () => {
        it('removes user data based on input key', () => {
            // TODO
        });

        it('throws and catches error when an error has occurred', () => {
            // TODO
        });
    });
});
