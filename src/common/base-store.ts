// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HandlerReturnType } from 'common/flux/event-handler-list';

export interface BaseStore<TState, TReturn extends HandlerReturnType = void> {
    getId(): string;
    getState(): TState;
    addChangedListener(handler: (store: this, args?: unknown) => TReturn): void;
    removeChangedListener(handler: (store: this, args?: unknown) => TReturn): void;
}
