// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface IDBObjectStore {
    openKeyCursor(range?: IDBKeyRange | IDBValidKey, direction?: IDBCursorDirection): IDBRequest;
}
