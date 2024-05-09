// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValue, ColumnValueBag } from './column-value-bag';

export const NoValue = '(no value)';
export interface PropertyBagColumnRendererConfig<TPropertyBag extends ColumnValueBag> {
    propertyName: keyof TPropertyBag & string;
    displayName: string;
    defaultValue?: ColumnValue;
    expand?: boolean;
}
