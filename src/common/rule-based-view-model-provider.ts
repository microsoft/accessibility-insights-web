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

        let ruleResult = getExistingRuleFromResults(result.ruleId, ruleResults);

        if (!ruleResult) {
            const rule = getUnifiedRule(result.ruleId, rules);
            if (!rule) {
                continue;
            }

            ruleResult = createCardRuleResult(result.status, rule);
            ruleResults.push(ruleResult);
        }

        ruleResult.nodes.push(result);

        ruleIdsWithResultNodes.add(result.ruleId);
    }

    for (const rule of rules) {
        if (!ruleIdsWithResultNodes.has(rule.id)) {
            statusResults.inapplicable.push(createRuleResultWithoutNodes('inapplicable', rule));
        }
    }

    return statusResults;
};

const getExistingRuleFromResults = (ruleId: string, ruleResults: CardRuleResult[]): CardRuleResult => {
    const ruleResultIndex: number = getRuleResultIndex(ruleId, ruleResults);

    return ruleResultIndex !== -1 ? ruleResults[ruleResultIndex] : null;
};

const getEmptyStatusResults = (): CardRuleResultsByStatus => {
    const statusResults = {};

    AllRuleResultStatuses.forEach(status => {
        statusResults[status] = [];
    });

    return statusResults as CardRuleResultsByStatus;
};

const createCardRuleResult = (status: string, rule: UnifiedRule): CardRuleResult => ({
    id: rule.id,
    status: status,
    nodes: [],
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

const getRuleResultIndex = (ruleId: string, ruleResults: CardRuleResult[]): number => ruleResults.findIndex(result => result.id === ruleId);
