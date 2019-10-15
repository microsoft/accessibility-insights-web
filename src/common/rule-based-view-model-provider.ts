// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AllRuleResultStatuses, CardRuleResult, CardRuleResultsByStatus, CardRuleResultStatus } from './types/store-data/card-view-model';
import { UnifiedResult, UnifiedRule } from './types/store-data/unified-data-interface';

export type GetUnifiedRuleResultsDelegate = (rules: UnifiedRule[], results: UnifiedResult[]) => CardRuleResultsByStatus;

export const getUnifiedRuleResults: GetUnifiedRuleResultsDelegate = (
    rules: UnifiedRule[],
    results: UnifiedResult[],
): CardRuleResultsByStatus => {
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

const getEmptyStatusResults = (): CardRuleResultsByStatus => {
    const statusResults = {};

    AllRuleResultStatuses.forEach(status => {
        statusResults[status] = [];
    });

    return statusResults as CardRuleResultsByStatus;
};

const createUnifiedRuleResult = (result: UnifiedResult, rule: UnifiedRule): CardRuleResult => ({
    id: rule.id,
    status: result.status,
    nodes: [result],
    description: rule.description,
    url: rule.url,
    guidance: rule.guidance,
});

const createRuleResultWithoutNodes = (status: CardRuleResultStatus, rule: UnifiedRule): CardRuleResult => ({
    id: rule.id,
    status: status,
    nodes: [],
    description: rule.description,
    url: rule.url,
    guidance: rule.guidance,
});

const getUnifiedRule = (id: string, rules: UnifiedRule[]): UnifiedRule => rules.find(rule => rule.id === id);

const getRuleResultIndex = (result: UnifiedResult, ruleResults: CardRuleResult[]): number =>
    ruleResults.findIndex(ruleResult => ruleResult.id === result.ruleId);
