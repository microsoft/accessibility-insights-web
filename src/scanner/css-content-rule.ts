// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from './iruleresults';

const cssContentCheckId: string = 'css-content';
const cssContentRuleId = cssContentCheckId;

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
        matches: isAbsolutePositionOrRightFloat,
        enabled: false,
    },
};

export function isAbsolutePositionOrRightFloat(node: HTMLElement): boolean {
    const nodeStyle = window.getComputedStyle(node);
    const position = nodeStyle.getPropertyValue('position').toLowerCase();
    const float = nodeStyle.getPropertyValue('float').toLowerCase();

    return position === 'absolute' || float === 'right';
}
