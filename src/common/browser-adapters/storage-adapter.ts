// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type StorageAdapter = {
    setUserData(items: Object, callback?: () => void): void;
    setUserDataP(items: Object): Promise<void>;
    getUserData(keys: string | string[] | Object, callback: (items: { [key: string]: any }) => void): void;
    removeUserData(key: string): void;
};
