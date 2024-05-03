// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetSizePropertyBag } from 'common/types/property-bag/target-size-property-bag';
import { ColumnValue, ColumnValueBag } from './column-value-bag';
import * as React from 'react';

export const NoValue = '(no value)';
export interface PropertyBagColumnRendererConfig<TPropertyBag extends ColumnValueBag> {
    propertyName: keyof TPropertyBag & string;
    displayName: string;
    defaultValue?: ColumnValue;
    expand?: boolean;
    neededPropertyBagValues: (keyof TPropertyBag & string)[];
    compute: (propertyBag: TargetSizePropertyBag) => typeof React.Component;
    render?: (element: JSX.Element) => JSX.Element;
}
