// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const duplicatIdCheckId: string = 'duplicate-id';

export const duplicateIdConfiguration: RuleConfiguration = {
    checks: [
        {
            id: duplicatIdCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: 'duplicate-id',
        selector: 'body',
        any: [duplicatIdCheckId],
        tags: ['best-practice', 'wcag411'],
    },
};
