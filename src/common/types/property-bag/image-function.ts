// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface ImageFunctionPropertyBag extends ColumnValueBag {
    imageType: string;
    accessibleName: string;
    codedAs: string;
    role: string;
}
