// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BestPractice } from 'scanner/rule-to-links-mappings';
import { DictionaryStringTo } from 'types/common-types';
import { HyperlinkDefinition } from 'views/content/content-page';
import { IRuleConfiguration } from 'scanner/iruleresults';

export type RuleIncluded =
    | { status: 'included'; reason?: string }
    | { status: 'excluded'; reason: string };

export const explicitRuleOverrides: DictionaryStringTo<RuleIncluded> = {
    'audio-caption': {
        status: 'included',
        reason: 'for parity with video-caption, which axe-core includes by default',
    },
};

export const getRuleInclusions = (
    ruleset: IRuleConfiguration[],
    ruleToLinksMap: DictionaryStringTo<HyperlinkDefinition[]>,
    ruleOverrides: DictionaryStringTo<RuleIncluded>,
): DictionaryStringTo<RuleIncluded> => {
    return Object.assign(
        {},
        ...ruleset.map(r => ({
            [r.id]: getRuleIncludedConfig(r, ruleToLinksMap, ruleOverrides),
        })),
    );
};

function getRuleIncludedConfig(
    rule: IRuleConfiguration,
    ruleToLinksMap: DictionaryStringTo<HyperlinkDefinition[]>,
    ruleOverrides: DictionaryStringTo<RuleIncluded>,
): RuleIncluded {
    if (ruleOverrides.hasOwnProperty(rule.id)) {
        return ruleOverrides[rule.id];
    }

    if (!rule.enabled) {
        return {
            status: 'excluded',
            reason: 'disabled in axe config',
        };
    }

    if (!ruleToLinksMap.hasOwnProperty(rule.id)) {
        return {
            status: 'excluded',
            reason: 'no guidance link mapping',
        };
    }

    if (ruleToLinksMap[rule.id].includes(BestPractice)) {
        return {
            status: 'excluded',
            reason: 'rule maps to BestPractice',
        };
    }

    return {
        status: 'included',
    };
}
