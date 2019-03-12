// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface PartialTabOrderPropertyBag {
    timestamp: number;
}

// tslint:disable-next-line:interface-name
export interface ITabOrderPropertyBag extends PartialTabOrderPropertyBag {
    tabOrder: number;
}
