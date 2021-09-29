// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const colorCheckId: string = 'select-all-elements';

export const colorConfiguration: RuleConfiguration = {
    checks: [
        {
            id: colorCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: 'select-all-elements',
        selector: '*',
        any: [colorCheckId],
        matches: () => isInTopWindow(window),
        enabled: false,
    },
};

export function isInTopWindow(win: any): boolean {
    return win.top === win;
}
