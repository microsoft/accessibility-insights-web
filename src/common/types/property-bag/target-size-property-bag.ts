// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface TargetSizePropertyBag extends ColumnValueBag {
    width?: number;
    height?: number;
    closestOffset?: number;
    sizeMessageKey?: string;
    offsetMessageKey?: string;
    sizeStatus?: string;
    offsetStatus?: string;
    minSize?: number;
    minOffset?: number;
}
