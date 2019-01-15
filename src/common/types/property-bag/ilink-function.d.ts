// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BagOf, ColumnValueBag } from './column-value-bag';

export interface ILinkFunctionPropertyBag extends ColumnValueBag {
    accessibleName: string;
    url: string;
    role: string;
    ariaAttributes: BagOf<string>;
    tabIndex: number;
    snippet: string;
}
