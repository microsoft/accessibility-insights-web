// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FocusableElement, tabbable } from 'tabbable';

export interface TabbableElementInfo {
    html: string;
    selector: string;
    order: number;
}

export class TabbableElementGetter {
    constructor(private doc: Document, private getTabbableElements: typeof tabbable) {}

    public getRawElements: () => FocusableElement[] = () => {
        const tabbableElements = this.getTabbableElements(this.doc.documentElement, {
            getShadowRoot: true,
        });
        const filteredElements = this.filterHiddenElements(tabbableElements);
        return filteredElements;
    };

    private filterHiddenElements: (elements: FocusableElement[]) => FocusableElement[] = (
        elements: FocusableElement[],
    ) => {
        const hiddenSelectors = ['div[aria-hidden="true"]', 'div[aria-modal="true"]'];
        hiddenSelectors.forEach(selector => {
            const hiddenElements = this.doc.querySelectorAll(selector);
            if (hiddenElements) {
                elements = elements.filter(
                    e => !Array.from(hiddenElements).some(hidden => hidden.contains(e)),
                );
            }
        });
        return elements;
    };
}
