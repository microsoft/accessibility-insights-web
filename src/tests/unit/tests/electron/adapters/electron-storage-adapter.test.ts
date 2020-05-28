// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { ElectronStorageAdapter } from 'electron/adapters/electron-storage-adapter';
import { IMock, Mock, Times } from 'typemoq';

describe('ElectronStorageAdapter', () => {
    let indexedDBInstanceMock: IMock<IndexedDBAPI>;

    let testSubject: ElectronStorageAdapter;

    beforeEach(() => {
        indexedDBInstanceMock = Mock.ofType<IndexedDBAPI>();
        testSubject = new ElectronStorageAdapter(indexedDBInstanceMock.object);
    });

    describe('setUserData', () => {
        it.each`
            items
            ${{}}
            ${{ first: 1 }}
            ${{ first: 1, second: '2' }}
            ${{ first: [1, 2], second: { a: 'a', b: 'b' } }}
        `('succeed to set $items', async ({ items }) => {
            await testSubject.setUserData(items);

            Object.keys(items).forEach(key =>
                indexedDBInstanceMock.verify(db => db.setItem(key, items[key]), Times.once()),
            );
        });

        it('propagates exceptions from indexedDB as-is', async () => {
            const reason = 'test-error-reason';

            const firstKey = 'first';

            const items = {
                [firstKey]: 1,
            };

            indexedDBInstanceMock
                .setup(indexedDB => indexedDB.setItem(firstKey, items[firstKey]))
                .returns(() => Promise.reject(reason));

            await expect(testSubject.setUserData(items)).rejects.toMatch(reason);
        });
    });

    describe('getUserData', () => {
        it.each`
            items
            ${{}}
            ${{ first: 1 }}
            ${{ first: 1, second: '2' }}
            ${{ first: [1, 2], second: { a: 'a', b: 'b' } }}
            ${{ first: 1, second: undefined }}
        `('properly reads $items', async ({ items }) => {
            const keys = Object.keys(items);

            keys.forEach(key =>
                indexedDBInstanceMock
                    .setup(db => db.getItem(key))
                    .returns(() => Promise.resolve(items[key])),
            );

            const result = await testSubject.getUserData(keys);

            expect(result).toEqual(items);
            expect(result).not.toBe(items);
        });

        it('propagates exceptions from indexedDB as-is', async () => {
            const reason = 'test-error-reason';

            const firstKey = 'first';

            indexedDBInstanceMock
                .setup(db => db.getItem(firstKey))
                .returns(() => Promise.reject(reason));

            await expect(testSubject.getUserData([firstKey])).rejects.toMatch(reason);
        });
    });

    describe('removeUserData', () => {
        const key = 'first';

        it('based on input key', async () => {
            await testSubject.removeUserData(key);

            indexedDBInstanceMock.verify(db => db.removeItem(key), Times.once());
        });

        it('propagate exceptions from indexedDB as-is', async () => {
            const reason = 'test-error-reason';

            indexedDBInstanceMock
                .setup(db => db.removeItem(key))
                .returns(() => Promise.reject(reason));

            await expect(testSubject.removeUserData(key)).rejects.toMatch(reason);
        });
    });
});
