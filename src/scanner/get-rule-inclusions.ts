// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from 'types/common-types';
import { IRuleConfiguration } from 'scanner/iruleresults';

export type RuleIncluded =
    | { status: 'included'; reason?: string }
    | { status: 'excluded'; reason: string };

export const explicitRuleOverrides: DictionaryStringTo<RuleIncluded> = {
    'audio-caption': {
        status: 'included',
        reason: 'for parity with video-caption, which axe-core includes by default',
    },
    'form-field-multiple-labels': {
        status: 'excluded',
        reason:
            "only reports needs-review results, but we haven't implemented needs-review content for it yet",
    },
};

export const getRuleInclusions = (
    ruleset: IRuleConfiguration[],
    ruleOverrides: DictionaryStringTo<RuleIncluded>,
): DictionaryStringTo<RuleIncluded> => {
    return Object.assign(
        {},
        ...ruleset.map(r => ({
            [r.id]: getRuleIncludedConfig(r, ruleOverrides),
        })),
    );
};

function getRuleIncludedConfig(
    rule: IRuleConfiguration,
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

    if (rule.tags == null) {
        return {
            status: 'excluded',
            reason: 'rule does not define a tags property',
        };
    }

    if (rule.tags.includes('experimental')) {
        return {
            status: 'excluded',
            reason: 'rule is tagged experimental',
        };
    }

    if (rule.tags.includes('best-practice')) {
        return {
            status: 'excluded',
            reason: 'rule is tagged best-practice',
        };
    }

    return {
        status: 'included',
    };
}
