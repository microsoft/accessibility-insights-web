// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IBaseStore } from '../../common/istore';

export class StoreStub<T> implements IBaseStore<T> {
    public getId(): string {
        throw new Error('Method not implemented.');
    }
    public getState(): T {
        throw new Error('Method not implemented.');
    }
    public addChangedListener(handler: Function): void {
        throw new Error('Method not implemented.');
    }
    public removeChangedListener(handler: Function): void {
        throw new Error('Method not implemented.');
    }
}
