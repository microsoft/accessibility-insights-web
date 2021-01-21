// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const spacingCheckId: string = 'text-spacing';

export const textSpacingConfiguration: RuleConfiguration = {
    checks: [
        {
            id: spacingCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: 'text-spacing',
        selector: 'body',
        any: [spacingCheckId],
        enabled: false,
    },
};
