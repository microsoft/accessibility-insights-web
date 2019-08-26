// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    UnifiedRuleResult,
    UnifiedRuleResultStatus,
    UnifiedStatusResults,
} from '../DetailsView/components/cards/failed-instances-section-v2';
import { AllInstanceResultStatuses, UnifiedResult, UnifiedRule } from './types/store-data/unified-data-interface';

export function getUnifiedRuleResults(rules: UnifiedRule[], results: UnifiedResult[]): UnifiedStatusResults {
    const statusInapplicable = 'inapplicable';
    const RuleResultStatus = [...AllInstanceResultStatuses, statusInapplicable];
    const statusResults = {} as UnifiedStatusResults;

    RuleResultStatus.forEach(status => {
        statusResults[status] = [];
    });

    const ruleIdsWithResultNodes: Set<string> = new Set();

    for (const result of results) {
        resultToRuleResult(result, rules, result.status, statusResults[result.status]);
        ruleIdsWithResultNodes.add(result.ruleId);
    }

    for (const rule of rules) {
        if (!ruleIdsWithResultNodes.has(rule.id)) {
            statusResults[statusInapplicable].push(createRuleResultWithoutNodes(rule));
        }
    }

    return statusResults;
}

function resultToRuleResult(
    result: UnifiedResult,
    rules: UnifiedRule[],
    status: UnifiedRuleResultStatus,
    ruleResults: UnifiedRuleResult[],
): void {
    const ruleResultIndex: number = ruleResults.findIndex(ruleResult => ruleResult.id === result.ruleId);
    if (ruleResultIndex !== -1) {
        ruleResults[ruleResultIndex].nodes.push(result);
    } else {
        const unifiedRule: UnifiedRule = getUnifiedRule(result.ruleId, rules);
        if (unifiedRule) {
            ruleResults.push(createUnifiedRuleResult(status, result, unifiedRule));
        }
    }
}

function createUnifiedRuleResult(status: UnifiedRuleResultStatus, result: UnifiedResult, rule: UnifiedRule): UnifiedRuleResult {
    return {
        id: rule.id,
        status: status,
        nodes: [result],
        description: rule.description,
        url: rule.url,
        guidance: rule.guidance,
    };
}

function createRuleResultWithoutNodes(rule: UnifiedRule): UnifiedRuleResult {
    return {
        id: rule.id,
        status: 'inapplicable',
        nodes: [],
        description: rule.description,
        url: rule.url,
        guidance: rule.guidance,
    };
}

function getUnifiedRule(id: string, rules: UnifiedRule[]): UnifiedRule {
    return rules.find(rule => rule.id === id);
}
