// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type StorageAdapter = {
    setUserData(items: Object): Promise<void>;
    getUserDataP(keys: string[]): Promise<{ [key: string]: any }>;
    getUserData(keys: string[], callback: (items: { [key: string]: any }) => void): void;
    removeUserData(key: string): void;
};
