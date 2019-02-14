// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from './iruleresults';

const meaningfulSequenceCheckId: string = 'meaningful-sequence';

export const meaningfulSequenceConfiguration: RuleConfiguration = {
    checks: [
        {
            id: meaningfulSequenceCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: meaningfulSequenceCheckId,
        selector: '*',
        any: [meaningfulSequenceCheckId],
        matches: matchesMeaningfulSequence,
        enabled: false,
    },
};

export function matchesMeaningfulSequence(node: HTMLElement): boolean {
    const nodeStyle = window.getComputedStyle(node);
    const position = nodeStyle.getPropertyValue('position').toLowerCase();
    const float = nodeStyle.getPropertyValue('float').toLowerCase();

    return position === 'absolute' || float === 'right';
}
