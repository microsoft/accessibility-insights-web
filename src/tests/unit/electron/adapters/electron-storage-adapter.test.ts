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

    beforeEach(() => {
        indexedDBInstanceMock = Mock.ofType<IndexedDBAPI>();
        electronStorageAdapter = new ElectronStorageAdapter(indexedDBInstanceMock.object);
    });

    it('sets user data with input items', () => {
        const expectedData = {
            testKey1: 'test-value-1',
            testKey2: 'test-value-2',
        };

        indexedDBInstanceMock
            .setup(async indexedDB => await indexedDB.setItem(IndexedDBDataKeys.installation, It.isValue(expectedData)))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        electronStorageAdapter.setUserData(expectedData);
        indexedDBInstanceMock.verifyAll();
    });

    it('gets user data using input keys', () => {
        const expectedData = {
            testKey1: 'test-value-1',
            testKey2: 'test-value-2',
        };
        indexedDBInstanceMock
            .setup(indexedDB => indexedDB.getItem(IndexedDBDataKeys.installation))
            .returns(() => Promise.resolve(expectedData))
            .verifiable(Times.once());

        electronStorageAdapter.getUserData(undefined, data => {
            expect(data).toBe(expectedData);
        });
        indexedDBInstanceMock.verifyAll();
    });

    it('removes user data based on input key', () => {
        indexedDBInstanceMock
            .setup(indexedDB => indexedDB.removeItem(IndexedDBDataKeys.installation))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        electronStorageAdapter.removeUserData(IndexedDBDataKeys.installation);
        indexedDBInstanceMock.verifyAll();
    });
});
