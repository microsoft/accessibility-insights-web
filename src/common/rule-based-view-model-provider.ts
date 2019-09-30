// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRuleResult, UnifiedStatusResults } from './components/cards/failed-instances-section';
import { AllRuleResultStatuses, UnifiedResult, UnifiedRule, UnifiedRuleResultStatus } from './types/store-data/unified-data-interface';

export type GetUnifiedRuleResultsDelegate = (rules: UnifiedRule[], results: UnifiedResult[]) => UnifiedStatusResults;

export const getUnifiedRuleResults: GetUnifiedRuleResultsDelegate = function(
    rules: UnifiedRule[],
    results: UnifiedResult[],
): UnifiedStatusResults {
    if (results == null || rules == null) {
        return null;
    }

    const statusResults = getEmptyStatusResults();
    const ruleIdsWithResultNodes: Set<string> = new Set();

    for (const result of results) {
        const ruleResults = statusResults[result.status];
        const ruleResultIndex: number = getRuleResultIndex(result, ruleResults);

        if (ruleResultIndex !== -1) {
            ruleResults[ruleResultIndex].nodes.push(result);
        } else {
            const unifiedRule: UnifiedRule = getUnifiedRule(result.ruleId, rules);
            if (unifiedRule) {
                ruleResults.push(createUnifiedRuleResult(result, unifiedRule));
            }
        }

        ruleIdsWithResultNodes.add(result.ruleId);
    }

    for (const rule of rules) {
        if (!ruleIdsWithResultNodes.has(rule.id)) {
            statusResults.inapplicable.push(createRuleResultWithoutNodes('inapplicable', rule));
        }
    }

    return statusResults;
};

function getEmptyStatusResults(): UnifiedStatusResults {
    const statusResults = {};

    AllRuleResultStatuses.forEach(status => {
        statusResults[status] = [];
    });

    return statusResults as UnifiedStatusResults;
}

function createUnifiedRuleResult(result: UnifiedResult, rule: UnifiedRule): UnifiedRuleResult {
    return {
        id: rule.id,
        status: result.status,
        nodes: [result],
        description: rule.description,
        url: rule.url,
        guidance: rule.guidance,
    };
}

function createRuleResultWithoutNodes(status: UnifiedRuleResultStatus, rule: UnifiedRule): UnifiedRuleResult {
    return {
        id: rule.id,
        status: status,
        nodes: [],
        description: rule.description,
        url: rule.url,
        guidance: rule.guidance,
    };
}

function getUnifiedRule(id: string, rules: UnifiedRule[]): UnifiedRule {
    return rules.find(rule => rule.id === id);
}

function getRuleResultIndex(result: UnifiedResult, ruleResults: UnifiedRuleResult[]): number {
    return ruleResults.findIndex(ruleResult => ruleResult.id === result.ruleId);
}
