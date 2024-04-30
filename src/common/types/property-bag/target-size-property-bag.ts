/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ColumnValueBag } from './column-value-bag';

export interface TargetSizePropertyBag extends ColumnValueBag {
    width?: number;
    height?: number;
    closestOffset?: number;
    messageKey?: string;
    sizeMessage?: string;
    offsetMessage?: string;
    minSize?: number;
    minOffset?: number;
}
