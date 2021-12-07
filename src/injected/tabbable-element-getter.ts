// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { getUniqueSelector } from 'scanner/axe-utils';
import { tabbable } from 'tabbable';

export interface SelectorToElementMap {
    [selector: string]: {
        html: string;
    };
}

export interface TabbableElementInfo {
    html: string;
    selector: string;
    order: number;
}

export class TabbableElementGetter {
    constructor(private doc: Document, private generateSelector: typeof getUniqueSelector) {}

    public get: () => TabbableElementInfo[] = () => {
        return tabbable(this.doc.documentElement).map((elem, index) => ({
            html: elem.outerHTML,
            selector: this.generateSelector(elem as HTMLElement),
            order: index,
        }));
    };
}
