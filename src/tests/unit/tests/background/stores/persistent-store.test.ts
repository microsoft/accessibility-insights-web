// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { IMock, Mock, Times } from 'typemoq';
import { StoreNames } from '../../../../../common/stores/store-names';

describe('PersistentStoreTest', () => {
    const storeName: StoreNames = -1;
    const persistedState: TestData = { value: 'persistedState' };
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();
    const indexedDBDataKey: string = 'indexedDBDataKey';
    const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

    test('getDefaultState', () => {
        const testObject = new TestStore();

        expect(testObject.getDefaultState()).toEqual(persistedState);
    });

    test('persistData', async () => {
        const testObject = new TestStore();
        const newData = { value: 'newData' };
        idbInstanceMock
            .setup(db => db.setItem(indexedDBDataKey, newData))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        await testObject.callPersistData(newData);

        idbInstanceMock.verifyAll();
    });

    test('emitChanged', async () => {
        const testObject = new TestStore();
        testObject.initialize();
        idbInstanceMock
            .setup(db => db.setItem(indexedDBDataKey, persistedState))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        testObject.callEmitChanged();

        idbInstanceMock.verifyAll();
    });

    test('emitChanged with null parameters', async () => {
        const testObject = new TestStore(false);
        testObject.initialize();
        idbInstanceMock
            .setup(db => db.setItem(indexedDBDataKey, persistedState))
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        testObject.callEmitChanged();

        idbInstanceMock.verifyAll();
    });

    interface TestData {
        value: string;
    }

    class TestStore extends PersistentStore<TestData> {
        constructor(passNonNullParams = true) {
            if (passNonNullParams) {
                super(
                    storeName,
                    persistedState,
                    idbInstanceMock.object,
                    indexedDBDataKey,
                    loggerMock.object,
                );
            } else {
                super(null, null, null, null, null);
            }
        }

        protected addActionListeners(): void {
            // Tested in base-store.tests.ts
        }

        public callEmitChanged() {
            this.emitChanged();
        }

        public async callPersistData(data: TestData) {
            await this.persistData(data);
        }
    }
});
