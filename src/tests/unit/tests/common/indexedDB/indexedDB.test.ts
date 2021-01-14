// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBUtil } from 'common/indexedDB/indexedDB';
import * as fakeIndexedDB from 'fake-indexeddb';
import { createStore } from 'idb-keyval';

describe('IndexedDBUtil test cases', () => {
    const defaultDBName = 'default-db';
    const defaultStoreName = 'default-store';
    let idbInstance;
    let store;
    beforeAll(() => {
        global['indexedDB'] = fakeIndexedDB;
        store = createStore(defaultDBName, defaultStoreName);
        idbInstance = new IndexedDBUtil(store);
    });

    test('setting key-value pair works properly', async () => {
        const value = 'IndexedDBUtil';
        const setSuccess: boolean = await idbInstance.setItem('test', value);
        expect(setSuccess).toBeTruthy();

        const size: number = await idbInstance.getSize();
        expect(size).toBe(1);
    });

    test('getting items already set works', async () => {
        const value = await idbInstance.getItem('test');
        expect(value).toBe('IndexedDBUtil');
        expect(await idbInstance.getItem('random')).toBeUndefined();
    });

    test('checking if delete works', async () => {
        const value = await idbInstance.setItem('test2', 'value2');
        expect(value).toBeTruthy();
        const size: number = await idbInstance.getSize();
        expect(size).toBe(2);

        // remove test2 and check if size is reduced to 1

        const deleteSuccess = await idbInstance.removeItem('test2');
        expect(deleteSuccess).toBeTruthy();

        const reducedSize: number = await idbInstance.getSize();
        expect(reducedSize).toBe(1);
    });

    test('should override already set value', async () => {
        const overrideSuccess = await idbInstance.setItem('test', 'override');
        expect(overrideSuccess).toBeTruthy();

        const currentValue = await idbInstance.getItem('test');
        expect(currentValue).not.toBe('IndexedDBUtil');
        expect(currentValue).toBe('override');

        expect(await idbInstance.getSize()).toBe(1);
    });
});
