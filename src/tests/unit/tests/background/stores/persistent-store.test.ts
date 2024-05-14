// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { IMock, It, Mock, Times } from 'typemoq';
import { StoreNames } from '../../../../../common/stores/store-names';

describe('PersistentStoreTest', () => {
    const storeName: StoreNames = -1 as StoreNames;
    const persistedState: TestData = { value: 'persistedState' };
    const defaultState: TestData = { value: null };
    const generatedState: TestData = { value: 'generatedState' };
    const idbInstanceMock: IMock<IndexedDBAPI> = Mock.ofType<IndexedDBAPI>();
    const indexedDBDataKey: string = 'indexedDBDataKey';
    const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

    describe('Persist store data', () => {
        beforeEach(() => {
            idbInstanceMock.reset();
        });

        test('Initialize with initial state', async () => {
            const testObject = new TestStore();

            const init = { value: 'value' };
            testObject.initialize(init);

            expect(testObject.getState()).toBe(init);
        });

        test('Initialize with persisted data', async () => {
            const testObject = new TestStore();

            testObject.initialize();

            expect(testObject.getState()).toStrictEqual(persistedState);
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

        test('do not persist data when it has not changed', async () => {
            const testObject = new TestStore();
            const data = { value: 'data' };
            await testObject.callPersistData(data);

            idbInstanceMock.reset();
            idbInstanceMock
                .setup(db => db.setItem(It.isAny(), It.isAny()))
                .verifiable(Times.never());

            await testObject.callPersistData(data);

            idbInstanceMock.verifyAll();
        });

        test('emitChanged', async () => {
            const testObject = new TestStore();
            testObject.initialize();
            idbInstanceMock
                .setup(db => db.setItem(indexedDBDataKey, persistedState))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await testObject.callEmitChanged();

            idbInstanceMock.verifyAll();
        });

        test('emitChanged with null parameters', async () => {
            const testObject = new TestStore(false);
            testObject.initialize();
            idbInstanceMock
                .setup(db => db.setItem(It.isAny(), It.isAny()))
                .verifiable(Times.never());

            await testObject.callEmitChanged();

            idbInstanceMock.verifyAll();
        });

        test('Teardown', async () => {
            const testObject = new TestStore();
            idbInstanceMock
                .setup(db => db.removeItem(indexedDBDataKey))
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await testObject.teardown();

            idbInstanceMock.verifyAll();
        });
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

        public getDefaultState(): TestData {
            return defaultState;
        }

        protected addActionListeners(): void {
            // Tested in base-store.tests.ts
        }

        public async callEmitChanged() {
            await this.emitChanged();
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
