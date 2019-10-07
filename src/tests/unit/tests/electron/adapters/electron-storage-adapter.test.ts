// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { ElectronStorageAdapter } from 'electron/adapters/electron-storage-adapter';

describe('ElectronStorageAdapter', () => {
    const testData = {
        testKey1: 'test-value-1',
        testKey2: 'test-value-2',
    };

    let indexedDBInstanceMock: IMock<IndexedDBAPI>;

    let testSubject: ElectronStorageAdapter;

    beforeEach(() => {
        indexedDBInstanceMock = Mock.ofType<IndexedDBAPI>();
        testSubject = new ElectronStorageAdapter(indexedDBInstanceMock.object);
    });

    describe('setUserData', () => {
        it('succeed', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(testData)))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await testSubject.setUserData(testData);

            indexedDBInstanceMock.verifyAll();
        });

        it('propagates exceptions from indexedDB as-is', async () => {
            const reason = 'test-error-reason';

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(testData)))
                .returns(() => Promise.reject(reason));

            await expect(testSubject.setUserData(testData)).rejects.toMatch(reason);
        });
    });

    describe('getUserData', () => {
        it('gets data, one key', async () => {
            const key = Object.keys(testData)[0];
            const keys = [key];

            indexedDBInstanceMock.setup(db => db.getItem(IndexedDBDataKeys.installation)).returns(() => Promise.resolve(testData));

            const result = await testSubject.getUserData(keys);

            const expected = {
                [key]: testData[key],
            };

            expect(result).toEqual(expected);
        });

        it('gets data, two keys', async () => {
            const keys = Object.keys(testData);

            indexedDBInstanceMock.setup(db => db.getItem(IndexedDBDataKeys.installation)).returns(() => Promise.resolve(testData));

            const result = await testSubject.getUserData(keys);

            expect(result).toEqual(testData);
        });

        it('propagates exceptions from indexedDB as-is', async () => {
            const reason = 'test-error-reason';

            indexedDBInstanceMock.setup(db => db.getItem(IndexedDBDataKeys.installation)).returns(() => Promise.reject(reason));

            await expect(testSubject.getUserData([])).rejects.toMatch(reason);
        });
    });

    describe('removeUserData', () => {
        it('removes based on input key', async () => {
            const keys = Object.keys(testData);

            const keyToRemove = keys[0];
            const keyToKeep = keys[1];

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.resolve(testData))
                .verifiable(Times.once());

            const expectedDataToSet = {
                [keyToKeep]: testData[keyToKeep],
            };

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(expectedDataToSet)))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await testSubject.removeUserData(keyToRemove);

            indexedDBInstanceMock.verifyAll();
        });

        it('fails during getItem when trying to remove data', async () => {
            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
                .returns(() => Promise.reject('remove-error'))
                .verifiable(Times.once());

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isAny()))
                .verifiable(Times.never());

            await expect(testSubject.removeUserData(IndexedDBDataKeys.installation)).rejects.toMatch('remove-error');

            indexedDBInstanceMock.verifyAll();
        });

        it('fails during setItem when trying to remove data', async () => {
            indexedDBInstanceMock.setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation)).returns(() => Promise.resolve({}));

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(IndexedDBDataKeys.installation, It.isAny()))
                .returns(() => Promise.reject('fail-set-item'));

            await expect(testSubject.removeUserData(IndexedDBDataKeys.installation)).rejects.toMatch('fail-set-item');
        });
    });
});
