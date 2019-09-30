// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type StorageAdapter = {
    setUserData(items: Object): Promise<void>;
    getUserData(keys: string[]): Promise<{ [key: string]: any }>;
    removeUserData(key: string): Promise<void>;
};
