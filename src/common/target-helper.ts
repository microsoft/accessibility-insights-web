// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Target } from 'scanner/iruleresults';

// This class deals with targets, which are returned from axe-core as an array of either strings
// or arrays of strings-- (string | string[])[]. The structure of the target can tell you several
// things about the dom elements:
//      - If the target is an array with one string, then that string is a css selector.
//      - If the target is an array with multiple strings, then the first [length - 1] array
//        elements point to nested iframes and the last element is a css selector in the nested
//        iframes.
//       -If the target is an array containing arrays of strings, then the dom element it points to
//        is in the shadow dom. For each array, the first [length - 1] array elements point to DOM
//        elements with a shadow DOM and the last array element is the final shadow DOM node.
// At various places in axe-core or our code, these structures must be serialized/ deserialized such
// that they are in the form of ['element0';'element1'] or [['element0','element1']].

export class TargetHelper {
    public static getTargetElements = (
        target: (string | string[])[],
        dom: Document,
        targetIndex,
    ): Element[] => {
        if (!target || target.length < 1) {
            return [];
        }
        const selectors = target[targetIndex];
        let elements: NodeListOf<Element> | null;
        if (typeof selectors === 'string') {
            elements = dom.querySelectorAll(selectors);
        } else {
            const shadowHost = this.getShadowHost(selectors, dom);
            if (!shadowHost || !shadowHost.shadowRoot) {
                return [];
            }
            elements = shadowHost.shadowRoot.querySelectorAll(selectors[selectors.length - 1]);
        }
        return Array.from(elements);
    };

    public static getTargetElement = (
        target: (string | string[])[],
        dom: Document,
        targetIndex,
    ) => {
        if (!target || target.length < 1) {
            return;
        }
        const selectors = target[targetIndex];
        if (typeof selectors === 'string') {
            return dom.querySelector(selectors);
        } else {
            const shadowHost = this.getShadowHost(selectors, dom);
            if (!shadowHost || !shadowHost.shadowRoot) {
                return;
            }
            return shadowHost.shadowRoot.querySelector(selectors[selectors.length - 1]);
        }
    };

    public static getTargetFromSelector = (selector: string): Target | undefined => {
        if (selector === '') {
            return [];
        }
        if (!selector) {
            return;
        }
        const selectors: string[] = selector.split(';');
        const shadowDomSelectors = selectors.map(selectors => {
            const shadowDomSelectors = selectors.split(',');
            if (shadowDomSelectors.length === 1) {
                return shadowDomSelectors[0];
            } else {
                return shadowDomSelectors;
            }
        });
        return shadowDomSelectors;
    };

    public static getSelectorFromTarget = (target: Target): string | undefined => {
        if (target) {
            return target
                .map((targets: string | string[]) =>
                    typeof targets === 'string' ? targets : targets.join(','),
                )
                .join(';');
        }
    };

    public static getSelectorFromTargetElement = (
        target: Target,
        targetIndex: number,
    ): string | undefined => {
        if (target && target[targetIndex]) {
            const element = target[targetIndex];
            return typeof element === 'string' ? element : element.join(',');
        }
    };

    private static getShadowHost = (selectors: string[], dom: Document): Element | null => {
        let shadowHost: Element | null = null;
        let queryElement: ShadowRoot | Document = dom;
        for (let i = 0; i < selectors.length - 1; i++) {
            shadowHost = queryElement.querySelector(selectors[i]);
            if (shadowHost == null || shadowHost.shadowRoot == null) {
                return null;
            }
            queryElement = shadowHost.shadowRoot;
        }
        return shadowHost;
    };
}
