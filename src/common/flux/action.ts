// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type ActionListener<TPayload, TReturn> = (payload: TPayload) => TReturn;

export interface Action<TPayload, TReturn> {
    invoke(payload: TPayload, scope?: string): TReturn;
    addListener(listener: ActionListener<TPayload, TReturn>): void;
}
