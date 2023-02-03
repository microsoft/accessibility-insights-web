// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IRuleConfiguration } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

export type RuleIncluded =
    // Rules included in automated checks by default
    | { status: 'included'; reason?: string }
    // Rules included when running any scan
    | { status: 'included-always'; reason: string }
    | { status: 'excluded'; reason: string };

export const explicitRuleOverrides: DictionaryStringTo<RuleIncluded> = {
    'aria-allowed-role': {
        status: 'included',
        reason: 'best practice rule that was investigated with no known false positives, implemented as an automated check.',
    },
    'audio-caption': {
        status: 'included',
        reason: 'for parity with video-caption, which axe-core includes by default',
    },
    'duplicate-id': {
        status: 'excluded',
        reason: 'Based on feedback from users we tested to check the user impact of duplicate ID failures on static elements. We found no user impact on the experience with any of the ATs including Narrator, JAWS, NVDA, Dragon, and Windows Speech Recognition. After further discussions with the Tooling Advisory Board, we decided to make this a best practice rule. See #4102.',
    },
    'empty-table-header': {
        status: 'excluded',
        reason: "only reports needs-review results, but we haven't implemented needs-review content for it yet",
    },
    'frame-tested': {
        status: 'included-always',
        reason: 'Tests for unresponsive frames, enables iframe skipped warning',
    },
    'frame-title-unique': {
        status: 'excluded',
        reason: "only reports needs-review results, but we haven't implemented needs-review content for it yet",
    },
    'form-field-multiple-labels': {
        status: 'excluded',
        reason: "only reports needs-review results, but we haven't implemented needs-review content for it yet",
    },
    'no-autoplay-audio': {
        status: 'excluded',
        reason: "only reports needs-review results, but we haven't implemented needs-review content for it yet",
    },
    'presentation-role-conflict': {
        status: 'included',
        reason: 'best practice rule that was investigated with no known false positives, implemented as an automated check.',
    },
    'scrollable-region-focusable': {
        status: 'excluded',
        reason: 'only reports to needs-review results due to potential false-positives',
    },
};

// all the rules we enable in needs review
export const needsReviewRules = [
    'aria-input-field-name',
    'color-contrast',
    'th-has-data-cells',
    'scrollable-region-focusable',
    'label-content-name-mismatch',
    'p-as-heading',
];

export const getNeedsReviewRulesConfig: () => DictionaryStringTo<RuleIncluded> = () => {
    const needsReviewRulesConfig = {};
    needsReviewRules.forEach(ruleId => (needsReviewRulesConfig[ruleId] = { enabled: true }));
    return needsReviewRulesConfig;
};

export const getIncludedAlwaysRules: () => string[] = () => {
    return Object.entries(explicitRuleOverrides)
        .filter(rule => rule[1].status === 'included-always')
        .map(rule => rule[0]);
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

    if (rule.tags.includes('wcag2aaa')) {
        return {
            status: 'excluded',
            reason: 'rule is tagged wcag2aaa',
        };
    }

    return {
        status: 'included',
    };
}
