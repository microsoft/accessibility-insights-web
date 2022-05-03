// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';

import { RuleConfiguration } from '../iruleresults';

const cssContentCheckId: string = 'css-content';
const cssContentRuleId: string = 'css-content';

export const cssContentConfiguration: RuleConfiguration = {
    checks: [
        {
            id: cssContentCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: cssContentRuleId,
        selector: 'body',
        matches: pageHasElementsWithPseudoSelectors,
        any: [cssContentCheckId],
        enabled: false,
    },
};

function pageHasElementsWithPseudoSelectors(node: HTMLElement): boolean {
    const pseudoElements = getAllPseudoElements(node);

    return pseudoElements.length > 0;
}

function getAllPseudoElements(node: HTMLElement): Element[] {
    const elements = node.querySelectorAll('*');

    const hasContent = styles => {
        return styles && styles.content !== 'none';
    };

    const pseudoElements: Element[] = [];
    for (let index = 0; index < elements.length; index++) {
        const element = elements.item(index);
        const beforeStyles = window.getComputedStyle(element, ':before');
        const afterStyles = window.getComputedStyle(element, ':after');

        if (
            axe.commons.dom.isVisible(element) &&
            (hasContent(beforeStyles) || hasContent(afterStyles))
        ) {
            pseudoElements.push(element);
        }
    }

    return pseudoElements;
}
