// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type StorageAPI = {
    setUserData(items: Object, callback?: () => void): void;
    getUserData(keys: string | string[] | Object, callback: (items: { [key: string]: any }) => void): void;
    removeUserData(key: string): void;
};

export class StorageAdapter implements StorageAPI {
    public setUserData(items: Object, callback?: () => void): void {
        chrome.storage.local.set(items, callback);
    }

    public getUserData(keys: string | string[] | Object, callback: (items: { [key: string]: any }) => void): void {
        chrome.storage.local.get(keys, callback);
    }

    public removeUserData(key: string): void {
        chrome.storage.local.remove(key);
    }
}
