// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface DictionaryStringTo<T> {
    [key: string]: T;
}

export interface DictionaryNumberTo<T> {
    [key: number]: T;
}

export interface FunctionPPR<TParam1, TParam2, TResult> {
    (param1: TParam1, param2?: TParam2): TResult;
}
