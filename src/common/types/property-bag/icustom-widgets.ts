// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BagOf, ColumnValueBag } from './column-value-bag';

export interface CustomWidgetPropertyBag extends ColumnValueBag {
    role: string;
    text: string; // Accessible name
    describedBy: string; // Accessible description
    ariaCues: BagOf<string>; // ARIA attributes
    htmlCues: BagOf<string>; // HTML cues
}
