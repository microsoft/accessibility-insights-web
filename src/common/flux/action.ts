// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface Action<TPayload, TReturn> {
    invoke(payload: TPayload, scope?: string): TReturn;
    addListener(listener: (payload: TPayload) => TReturn): void;
}
