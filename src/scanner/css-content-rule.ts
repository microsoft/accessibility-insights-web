// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from './iruleresults';

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
        selector: '*',
        any: [cssContentCheckId],
        matches: matches,
        enabled: false,
    },
};

function matches(node: HTMLElement): boolean {
    const nodeStyle = window.getComputedStyle(node);
    return isAbsolutePosition(nodeStyle) || isRightFloat(nodeStyle);
}

function isAbsolutePosition(nodeStyle: CSSStyleDeclaration): boolean {
    const position = nodeStyle.getPropertyValue('position').toLowerCase();
    return position === 'absolute';
}

function isRightFloat(nodeStyle: CSSStyleDeclaration): boolean {
    const float = nodeStyle.getPropertyValue('float').toLowerCase();
    return float === 'right';
}
