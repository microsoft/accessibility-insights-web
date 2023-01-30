// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TargetHelper } from 'common/target-helper';
import { uniq } from 'lodash';
import { AxeNodeResult } from '../../scanner/iruleresults';

export type RelatedSelectorNormalizer = typeof normalizeRelatedSelectors;
export type RelatedSelectorExtractor = typeof extractRelatedSelectors;

export function normalizeRelatedSelectors(nodeSelector: string, relatedSelectors?: string[]) {
    // This doesn't usually change anything; it would mainly affect if a rule had multiple
    // checks that each returned overlapping sets of related nodes. Axe generally returns
    // nodes in a reasonable order, so we want to use a method that preserves order here.
    relatedSelectors = uniq(relatedSelectors);

    // This does have a practical impact; some axe checks (eg, color-contrast) will occasionally
    // return the node itself as a "related node", and we'd rather avoid this.
    relatedSelectors = relatedSelectors.filter(relatedSelector => relatedSelector !== nodeSelector);

    return relatedSelectors.length === 0 ? undefined : relatedSelectors;
}

export function extractRelatedSelectors(nodeResult: AxeNodeResult): string[] | undefined {
    const nodeSelector = TargetHelper.getSelectorFromTarget(nodeResult.target);

    const relatedSelectors: string[] = [];
    for (const checkType of ['all', 'any', 'none'] as const) {
        const checks = nodeResult[checkType];
        for (const check of checks) {
            const relatedSelectorsForCheck =
                check.relatedNodes?.map(n => TargetHelper.getSelectorFromTarget(n.target)) ?? [];
            relatedSelectors.push(...relatedSelectorsForCheck);
        }
    }

    return normalizeRelatedSelectors(nodeSelector, relatedSelectors);
}
