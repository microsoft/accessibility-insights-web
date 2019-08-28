// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface StateChangesPropertyBag extends ColumnValueBag {
    accessibleName: string;
    role?: string;
    element?: string;
}
