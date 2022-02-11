// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { getUniqueSelector } from 'scanner/axe-utils';
import { FocusableElement, tabbable } from 'tabbable';

export interface TabbableElementInfo {
    html: string;
    selector: string;
    order: number;
}

export class TabbableElementGetter {
    constructor(
        private doc: Document,
        private generateSelector: typeof getUniqueSelector,
        private getTabbableElements: typeof tabbable,
    ) {}

    public get: () => TabbableElementInfo[] = () => {
        return this.getTabbableElements(this.doc.documentElement).map((elem, index) => ({
            html: elem.outerHTML,
            selector: this.generateSelector(elem as HTMLElement),
            order: index,
        }));
    };

    public getRawElements: () => FocusableElement[] = () => {
        return this.getTabbableElements(this.doc.documentElement);
    };
}
