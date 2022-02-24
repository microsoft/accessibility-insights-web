// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FocusIndicator } from './focus-indicator';

export interface TabbedItem {
    selector?: string;
    element: Element;
    highlightElement?: FocusIndicator;
    tabOrder: number;
    shouldRedraw?: boolean;
    isFailure?: boolean;
}
