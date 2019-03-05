// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IFocusIndicator } from './ifocus-indicator';

// tslint:disable-next-line:interface-name
export interface ITabbedItem {
    selector?: string;
    element: Element;
    focusIndicator?: IFocusIndicator;
    tabOrder: number;
    shouldRedraw?: boolean;
}
