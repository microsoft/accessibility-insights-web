// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getLabelInNameData, labelInNameMatches } from 'scanner/label-in-name-utils';
import { RuleConfiguration } from '../iruleresults';

const labelInNameCheckId: string = 'label-in-name';

export const labelInNameConfiguration: RuleConfiguration = {
    checks: [
        {
            id: labelInNameCheckId,
            evaluate: evaluateLabelInName,
        },
    ],
    rule: {
        id: labelInNameCheckId,
        selector: 'a[aria-label], a[aria-labelledby]',
        enabled: false,
        any: [labelInNameCheckId],
        matches: labelInNameMatches,
    },
};

function evaluateLabelInName(
    node: HTMLElement,
    options: any,
    virtualNode: any,
    context: any,
): boolean {
    const data = getLabelInNameData(node, virtualNode);
    this.data(data);
    // TODO: add telemetry
    return true;
}
