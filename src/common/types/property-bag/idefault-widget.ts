// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

// tslint:disable-next-line:interface-name
export interface IDefaultWidgetPropertyBag extends ColumnValueBag {
    element: string;
    accessibleName: string;
    accessibleDescription: string;
}
