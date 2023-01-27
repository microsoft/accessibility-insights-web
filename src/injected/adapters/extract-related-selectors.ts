// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { uniq } from 'lodash';
import { AxeNodeResult } from '../../scanner/iruleresults';

export type RelatedSelectorExtractor = typeof extractRelatedSelectors;

export function extractRelatedSelectors(nodeResult: AxeNodeResult): string[] | undefined {
    let output: string[] = [];
    for (const checkType of ['all', 'any', 'none'] as const) {
        const checks = nodeResult[checkType];
        for (const check of checks) {
            const relatedSelectors =
                check.relatedNodes?.map(n => TargetHelper.getSelectorFromTarget(n.target)) ?? [];
            output.push(...relatedSelectors);
        }
    }

    // This doesn't usually change anything; it would mainly affect if a rule had multiple
    // checks that each returned overlapping sets of related nodes. Axe generally returns
    // nodes in a reasonable order, so we want to use a method that preserves order here.
    output = uniq(output);

    // This does have a practical impact; some axe checks (eg, color-contrast) will occasionally
    // return the node itself as a "related node", and we'd rather avoid this.
    const selfSelector = TargetHelper.getSelectorFromTarget(nodeResult.target);
    output = output.filter(relatedSelector => relatedSelector !== selfSelector);

    return output.length === 0 ? undefined : output;
}
