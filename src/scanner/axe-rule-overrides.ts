// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as Axe from 'axe-core';

export namespace AxeRuleOverrides {
    export const overrideConfiguration = {
        checks: [
            {
                id: 'aria-allowed-attr',
                options: {
                    separator: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
                },
            },
        ],
        rules: [
            {
                id: 'audio-caption',
                enabled: true,
            },
        ],
    };

    export function overide(axe: typeof Axe) {
        axe.configure(overrideConfiguration as Axe.Spec);
    }
}
