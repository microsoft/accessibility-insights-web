// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface IPartialTabOrderPropertyBag {
    timestamp: number;
}

export interface ITabOrderPropertyBag extends IPartialTabOrderPropertyBag {
    tabOrder: number;
}
