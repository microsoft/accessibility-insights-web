// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const colorCheckId: string = 'select-html';

export const colorConfiguration: RuleConfiguration = {
    checks: [
        {
            id: colorCheckId,
            evaluate: () => true,
        },
    ],
    rule: {
        id: 'select-html',
        selector: 'html',
        any: [colorCheckId],
        matches: () => isInTopWindow(window),
        enabled: false,
    },
};

export function isInTopWindow(win: any): boolean {
    return win.top === win;
}
