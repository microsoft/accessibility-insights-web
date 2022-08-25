// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface LabelInNamePropertyBag extends ColumnValueBag {
    accessibleName: string;
    url: string;
}
