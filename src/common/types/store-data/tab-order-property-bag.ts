// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface PartialTabOrderPropertyBag {
    timestamp: number;
}

export interface TabOrderPropertyBag extends PartialTabOrderPropertyBag {
    tabOrder: number;
}
