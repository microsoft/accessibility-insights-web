// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export abstract class BaseDataBuilder<T> {
    protected data: T;

    constructor() {
        this.data = {} as T;
    }

    public build(): T {
        return this.data;
    }

    // tslint:disable-next-line: no-reserved-keywords
    public with<P extends keyof T>(property: P, value: T[P]): this {
        this.data[property] = value;
        return this;
    }
}
