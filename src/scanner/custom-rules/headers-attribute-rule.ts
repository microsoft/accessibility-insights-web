// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const headersAttributeCheckId: string = 'headers-attribute';

export const headersAttributeRuleConfiguration: RuleConfiguration = {
    checks: [
        {
            id: headersAttributeCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: 'headers-attribute',
        selector: 'th,td',
        any: [headersAttributeCheckId],
        enabled: false,
        matches: hasHeadersAttribute,
    },
};

function hasHeadersAttribute(node: HTMLElement): boolean {
    const headers = node.getAttribute('headers');

    return headers !== null;
}
