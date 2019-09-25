// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { IndexedDBDataKeys } from '../../../../background/IndexedDBDataKeys';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import { Logger } from '../../../../common/logging/logger';
import { ElectronStorageAdapter } from '../../../../electron/adapters/electron-storage-adapter';
import { tick } from '../../tests/electron/common/tick';

describe('ElectronStorageAdapter', () => {
    const expectedData = {
        testKey1: 'test-value-1',
        testKey2: 'test-value-2',
    };

    let indexedDBInstanceMock: IMock<IndexedDBAPI>;
    let loggerMock: IMock<Logger>;

    let testSubject: ElectronStorageAdapter;

    beforeEach(() => {
        indexedDBInstanceMock = Mock.ofType<IndexedDBAPI>();
        loggerMock = Mock.ofType<Logger>();
        testSubject = new ElectronStorageAdapter(indexedDBInstanceMock.object, loggerMock.object);
    });

    describe('setUserDataP', () => {
        it('succeed', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(expectedData)))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await testSubject.setUserData(expectedData);

            indexedDBInstanceMock.verifyAll();
            loggerMock.verify(logger => logger.error(It.isAny()), Times.never());
        });

        it('throws', async () => {
            const reason = 'test-error-reason';

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(expectedData)))
                .returns(() => Promise.reject(reason));

            await expect(testSubject.setUserData(expectedData)).rejects.toMatch(reason);
        });
    });

    describe('getUserData', () => {
        it('using input keys', () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.resolve(expectedData))
                .verifiable(Times.once());

            testSubject.getUserData(['testKey1'], async data => {
                await tick();
                expect(data).toEqual({ testKey1: 'test-value-1' });
            });

            indexedDBInstanceMock.verifyAll();
        });

        it('fails when trying to get user data', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.reject('get-error'))
                .verifiable(Times.once());

            loggerMock.setup(logger => logger.error('Error occurred when trying to get user data: ', 'get-error')).verifiable(Times.once());

            testSubject.getUserData(['testKey1'], data => {
                expect(data).toEqual(expectedData);
            });

            await tick();
            indexedDBInstanceMock.verifyAll();
            loggerMock.verifyAll();
        });
    });

    describe('removeUserData', () => {
        it('removes based on input key', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.resolve(expectedData))
                .verifiable(Times.once());

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            testSubject.removeUserData(IndexedDBDataKeys.installation);

            await tick();
            indexedDBInstanceMock.verifyAll();
        });

        it('fails during getItem when trying to remove data', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.reject('remove-error'))
                .verifiable(Times.once());

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isAny()))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.never());

            loggerMock
                .setup(logger => logger.error('Error occurred when trying to remove user data: ', 'remove-error'))
                .verifiable(Times.once());

            testSubject.removeUserData(IndexedDBDataKeys.installation);

            await tick();
            indexedDBInstanceMock.verifyAll();
            loggerMock.verifyAll();
        });

        it('fails during setItem when trying to remove data', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.resolve({}))
                .verifiable(Times.once());

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isAny()))
                .returns(() => Promise.reject('fail-set-item'))
                .verifiable(Times.once());

            loggerMock.setup(logger => logger.error('fail-set-item')).verifiable(Times.once());

            testSubject.removeUserData(IndexedDBDataKeys.installation);

            await tick();
            indexedDBInstanceMock.verifyAll();
            loggerMock.verifyAll();
        });
    });
});
