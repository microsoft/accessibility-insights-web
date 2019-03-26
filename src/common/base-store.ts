// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface BaseStore<TState> {
    getId(): string;
    getState(): TState;
    addChangedListener(handler: Function): void;
    removeChangedListener(handler: Function): void;
}
