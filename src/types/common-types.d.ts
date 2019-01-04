// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
interface IDictionaryStringTo<T> {
    [key: string]: T;
}
interface IDictionaryNumberTo<T> {
    [key: number]: T;
}
interface IFunctionPPR<TParam1, TParam2, TResult> {
    (param1: TParam1, param2: TParam2): TResult;
}
