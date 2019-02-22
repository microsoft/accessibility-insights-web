// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from './iruleresults';

const cssContentCheckId: string = 'css-content';
const cssContentRuleId: string = 'css-content';

export const cssPositioningConfiguration: RuleConfiguration = {
    checks: [
        {
            id: cssContentCheckId,
            evaluate: () => false,
        },
    ],
    rule: {
        id: cssContentRuleId,
        selector: 'body',
        any: [cssContentCheckId],
        enabled: false,
    },
};
