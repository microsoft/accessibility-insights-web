// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from './iruleresults';
import * as axe from 'axe-core';

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
    const psuedoElements = getPsuedo();

    return psuedoElements.length > 0;
}

function getPsuedo(): HTMLElement[] {
    const elements = document.querySelectorAll('*');

    const hasContent = styles => {
        return styles && styles.content !== 'none';
    };

    const psuedoElements = [];
    elements.forEach(element => {
        const beforeStyles = window.getComputedStyle(element, ':before');
        const afterStyles = window.getComputedStyle(element, ':after');

        if (axe.commons.dom.isVisible(element) && (hasContent(beforeStyles) || hasContent(afterStyles))) {
            psuedoElements.push(element);
        }
    });

    return psuedoElements;
}
