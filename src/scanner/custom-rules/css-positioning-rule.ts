// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { RuleConfiguration } from '../iruleresults';

const cssPositioningCheckId: string = 'css-positioning';
const cssPositioningRuleId: string = 'css-positioning';

export const cssPositioningConfiguration: RuleConfiguration = {
    checks: [
        {
            id: cssPositioningCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: cssPositioningRuleId,
        selector: '*',
        any: [cssPositioningCheckId],
        matches: matches,
        enabled: false,
    },
};

function matches(node: HTMLElement): boolean {
    const nodeStyle = window.getComputedStyle(node);
    return (
        axe.commons.dom.isVisible(node) &&
        (isAbsolutePosition(nodeStyle) || isRightFloat(nodeStyle))
    );
}

function isAbsolutePosition(nodeStyle: CSSStyleDeclaration): boolean {
    const position = nodeStyle.getPropertyValue('position').toLowerCase();
    return position === 'absolute';
}

function isRightFloat(nodeStyle: CSSStyleDeclaration): boolean {
    const float = nodeStyle.getPropertyValue('float').toLowerCase();
    return float === 'right';
}
