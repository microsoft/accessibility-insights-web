// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { del, get, keys, set, UseStore } from 'idb-keyval';

/**
 * API for IndexedDB Util
 * This API uses IndexedDB to store our data and throws an exception in case indexedDB is not available
 *
 */
export interface IndexedDBAPI {
    /**
     * @param  {string} key - sets the value for this key
     * @param  {any} value - sets value in indexedDB for specified key
     * @returns Promise - returns a promise with true/false for success/failure
     */
    setItem(key: string, value: any): Promise<boolean>;

    /**
     * @param  {string} key
     * @param  {string} storeName
     * @returns Promise - returns a promise that resolves to the value for key
     */
    getItem(key: string): Promise<any>;

    /**
     * @param  {string} key
     * @param  {string} storeName
     * @returns Promise - resolves to true/false for success/failure in removing item
     */
    removeItem(key: string): Promise<boolean>;

    /**
     * @param  {string} storeName
     * @returns Promise
     * returns a promise that resolves to provide the size of indexed db
     */
    getSize(): Promise<number>;
}

/**
 * Implementation for IndexedDBAPI defined above
 *
 * provides following functions
 * getItem, setItem, removeItem, getSize
 *
 * window.indexedDB is the param that tells us about availabiltiy
 *
 * Read more on IndexedDB: https://developers.google.com/web/ilt/pwa/working-with-indexeddb
 */
export class IndexedDBUtil implements IndexedDBAPI {
    constructor(private readonly store: UseStore) {}

    public async getItem(key: string): Promise<any> {
        try {
            return await get<any>(key, this.store);
        } catch (error) {
            return undefined;
        }
    }

    public async setItem(key: string, value: any): Promise<boolean> {
        try {
            await set(key, value, this.store);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async removeItem(key: string): Promise<boolean> {
        try {
            await del(key, this.store);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async getSize(): Promise<number> {
        try {
            const keyArray = await keys(this.store);
            return keyArray.length;
        } catch (error) {
            return 0;
        }
    }
}
