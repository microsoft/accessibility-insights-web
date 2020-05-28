// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnValueBag } from './column-value-bag';

export interface MeaningfulImagePropertyBag extends ColumnValueBag {
    imageType: string;
    accessibleName: string;
    role: string;
}
