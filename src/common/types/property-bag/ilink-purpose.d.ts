// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface LinkPurposePropertyBag extends ColumnValueBag {
    accessibleName: string;
    accessibleDescription: string;
    url: string;
}
