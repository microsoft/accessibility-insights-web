// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BagOf, ColumnValueBag } from './column-value-bag';

export interface WidgetFunctionPropertyBag extends ColumnValueBag {
    element: string;
    accessibleName: string;
    role: string;
    ariaAttributes: BagOf<string>;
    tabIndex: string;
}
