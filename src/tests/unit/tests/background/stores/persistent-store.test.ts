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
    const defaultState: TestData = { value: null };
    const generatedState: TestData = { value: 'generatedState' };
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();
    const indexedDBDataKey: string = 'indexedDBDataKey';
    const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

    test('getDefaultState', () => {
        const testObject = new TestStore();

        expect(testObject.getDefaultState()).toEqual(defaultState);
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

    describe('Initialize with store data', () => {
        test('Initialize with initial state', async () => {
            const testObject = new TestStore();

            const init = { value: 'value' };
            testObject.initialize(init);

            expect(testObject.getState()).toBe(init);
        });

        test('Initialize with persisted data', async () => {
            const testObject = new TestStore();

            testObject.initialize();

            expect(testObject.getState()).toBe(persistedState);
        });

        test('Initialize without persisted data', async () => {
            const testObject = new TestStore(false);

            testObject.initialize();

            expect(testObject.getState()).toBe(defaultState);
        });

        test('Initialize with persisted data and generateDefaultState override', async () => {
            const testObject = new GenerateDefaultStateTestStore();

            testObject.initialize();

            expect(testObject.getState()).toBe(generatedState);
        });

        test('Initialize without persisted data and generateDefaultState override', async () => {
            const testObject = new GenerateDefaultStateTestStore(false);

            testObject.initialize();

            expect(testObject.getState()).toBe(generatedState);
        });
    });

    describe('Initialize without store data', () => {
        test('Initialize with initial state', async () => {
            const testObject = new TestStore(true, false);

            const init = { value: 'value' };
            testObject.initialize(init);

            expect(testObject.getState()).toBe(init);
        });

        test('Initialize without initial state', async () => {
            const testObject = new TestStore(true, false);

            testObject.initialize();

            expect(testObject.getState()).toBe(defaultState);
        });
    });

    interface TestData {
        value: string;
    }

    class TestStore extends PersistentStore<TestData> {
        constructor(passNonNullParams = true, initializeWithStoreData = true) {
            if (passNonNullParams) {
                super(
                    storeName,
                    persistedState,
                    idbInstanceMock.object,
                    indexedDBDataKey,
                    loggerMock.object,
                    initializeWithStoreData,
                );
            } else {
                super(null, null, null, null, null, initializeWithStoreData);
            }
        }

        public getDefaultState(): TestData {
            return defaultState;
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

    class GenerateDefaultStateTestStore extends TestStore {
        protected generateDefaultState(persistedData: TestData): TestData {
            return generatedState;
        }
    }
});
