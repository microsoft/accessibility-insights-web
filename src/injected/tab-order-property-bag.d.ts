// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// tslint:disable-next-line:interface-name
export interface IPartialTabOrderPropertyBag {
    timestamp: number;
}

// tslint:disable-next-line:interface-name
export interface ITabOrderPropertyBag extends IPartialTabOrderPropertyBag {
    tabOrder: number;
}
