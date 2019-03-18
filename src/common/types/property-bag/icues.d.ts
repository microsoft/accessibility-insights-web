// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface CuesPropertyBag extends ColumnValueBag {
    element: string;
    accessibleName: string;
    htmlCues: BagOf<string>;
    ariaCues: BagOf<string>;
}
