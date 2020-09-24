// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BestPractice } from 'scanner/rule-to-links-mappings';
import { DictionaryStringTo } from 'types/common-types';
import { HyperlinkDefinition } from 'views/content/content-page';
import * as Axe from 'axe-core';
import { IRuleConfiguration } from 'scanner/iruleresults';

export interface RuleIncluded {
    status: 'included' | 'excluded';
    excludedReason: string | null;
}

const explicitRuleOverrides: DictionaryStringTo<RuleIncluded> = {
    'link-name': {
        status: 'excluded',
        excludedReason: 'temporarily excluded because of false positive (axe-core@2459)',
    },
};

export const getRuleInclusions = (
    axe: typeof Axe,
    ruleToLinksMap: DictionaryStringTo<HyperlinkDefinition[]>,
): DictionaryStringTo<RuleIncluded> => {
    return Object.assign(
        {},
        ...axe._audit.rules.map(r => ({
            [r.id]: getRuleIncludedConfig(r, ruleToLinksMap),
        })),
    );
};

function getRuleIncludedConfig(
    rule: IRuleConfiguration,
    ruleToLinksMap: DictionaryStringTo<HyperlinkDefinition[]>,
): RuleIncluded {
    if (explicitRuleOverrides.hasOwnProperty(rule.id)) {
        return explicitRuleOverrides[rule.id];
    }

    if (!rule.enabled) {
        return {
            status: 'excluded',
            excludedReason: 'disabled in axe config',
        };
    }

    if (!ruleToLinksMap.hasOwnProperty(rule.id)) {
        return {
            status: 'excluded',
            excludedReason: 'no guidance link mapping',
        };
    }

    if (ruleToLinksMap[rule.id].includes(BestPractice)) {
        // should we use Axe's mappings here?
        return {
            status: 'excluded',
            excludedReason: 'rule maps to BestPractice',
        };
    }

    return {
        status: 'included',
        excludedReason: null,
    };
}
