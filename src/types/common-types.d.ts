// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// tslint:disable-next-line:interface-name
interface IDictionaryStringTo<T> {
    [key: string]: T;
}
// tslint:disable-next-line:interface-name
interface IDictionaryNumberTo<T> {
    [key: number]: T;
}

interface FunctionPPR<TParam1, TParam2, TResult> {
    (param1: TParam1, param2: TParam2): TResult;
}
