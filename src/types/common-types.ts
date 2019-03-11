// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface DictionaryStringTo<T> {
    [key: string]: T;
}

interface DictionaryNumberTo<T> {
    [key: number]: T;
}

interface FunctionPPR<TParam1, TParam2, TResult> {
    (param1: TParam1, param2: TParam2): TResult;
}
