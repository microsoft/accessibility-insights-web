// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Target } from 'scanner/iruleresults';

export class TargetHelper {
    public static getTargetElements = (
        target: (string | string[])[],
        dom: Document,
        targetIndex,
    ) => {
        const selectors = target[targetIndex];
        let elements: NodeListOf<Element>;
        if (typeof selectors === 'string') {
            elements = dom.querySelectorAll(selectors);
        } else {
            const shadowHost = this.getShadowHost(selectors, dom);
            if (!shadowHost) {
                return;
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
        const selectors = target[targetIndex];
        if (typeof selectors === 'string') {
            return dom.querySelector(selectors);
        } else {
            const shadowHost = this.getShadowHost(selectors, dom);
            if (!shadowHost) {
                return;
            }
            return shadowHost.shadowRoot.querySelector(selectors[selectors.length - 1]);
        }
    };

    public static getTargetFromSelector = (selector: string): Target => {
        const selectors: string[] = selector.split(';');
        const shadowDomSelectors = selectors.map(selectors => {
            var shadowDomSelectors = selectors.split(',');
            if (shadowDomSelectors.length == 1) {
                return shadowDomSelectors[0];
            } else {
                return shadowDomSelectors;
            }
        });
        return shadowDomSelectors;
    };

    public static getSelectorFromTarget = (target: Target): string => {
        return target
            .map((targets: string | string[]) =>
                typeof targets === 'string' ? targets : targets.join(','),
            )
            .join(';');
    };

    private static getShadowHost = (selectors: string[], dom: Document): Element => {
        let shadowHost: Element;
        for (let i = 0; i < selectors.length - 1; i++) {
            shadowHost = dom.querySelector(selectors[i]);
            if (shadowHost == null || shadowHost.shadowRoot == null) {
                return;
            }
        }
        return shadowHost;
    };
}
