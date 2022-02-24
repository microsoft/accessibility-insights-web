// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FocusIndicator } from './focus-indicator';

export interface TabbedItem {
    selector?: string;
    element: Element;
    focusIndicator?: FocusIndicator;
    tabOrder: number;
    shouldRedraw?: boolean;
    itemType?: TabbedItemType;
}

export enum TabbedItemType {
    MissingItem = 'MissingItem',
    ErroredItem = 'ErroredItem',
}
