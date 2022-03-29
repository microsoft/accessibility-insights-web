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
        return this.getRawElements().map((elem, index) => ({
            html: elem.outerHTML,
            selector: this.generateSelector(elem as HTMLElement),
            order: index,
        }));
    };

    public getRawElements: () => FocusableElement[] = () => {
        const tabbableElements = this.getTabbableElements(this.doc.documentElement);
        const filteredElements = this.filterHiddenElements(tabbableElements);
        return filteredElements;
    };

    private filterHiddenElements: (elements: FocusableElement[]) => FocusableElement[] = (
        elements: FocusableElement[],
    ) => {
        const hiddenSelectors = ['div[aria-hidden="true"]', 'div[aria-modal="true"]'];
        hiddenSelectors.forEach(selector => {
            const hiddenElements = this.doc.querySelectorAll<FocusableElement>(
                `${selector}, ${selector} *`,
            );
            if (hiddenElements) {
                elements = elements.filter(e => !Array.from(hiddenElements).includes(e));
            }
        });
        return elements;
    };
}
