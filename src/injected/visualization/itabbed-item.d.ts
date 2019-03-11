// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IFocusIndicator } from './ifocus-indicator';

export interface TabbedItem {
    selector?: string;
    element: Element;
    focusIndicator?: IFocusIndicator;
    tabOrder: number;
    shouldRedraw?: boolean;
}
