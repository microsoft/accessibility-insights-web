// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const headersCheckId: string = 'collect-headers';

export const headerRuleConfiguration: RuleConfiguration = {
    checks: [
        {
            id: headersCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: 'collect-headers',
        selector: 'th,[role=columnheader],[role=rowheader]',
        any: [headersCheckId],
        enabled: false,
    },
};
