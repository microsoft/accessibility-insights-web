// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from '../scanner/rule-to-links-mappings';
import { InstanceResultStatus, UnifiedResult, UnifiedRule } from './types/store-data/unified-data-interface';

export interface UnifiedRuleResult {
    id: string;
    status: UnifiedRuleResultStatus;
    nodes: UnifiedResult[];
    description: string;
    url: string;
    guidance: GuidanceLink[];
}

export type UnifiedRuleResultStatus = InstanceResultStatus | 'inapplicable';

export type UnifiedStatusResults = {
    [key in UnifiedRuleResultStatus]: UnifiedRuleResult[];
};

export function getUnifiedRuleResults(rules: UnifiedRule[], results: UnifiedResult[]): UnifiedStatusResults {
    const statusResults = {
        pass: [],
        fail: [],
        unknown: [],
        inapplicable: [],
    };

    const ruleIdsWithResultNodes: Set<string> = new Set();

    for (const result of results) {
        if (result.status === 'pass') {
            resultToRuleResult(result, rules, result.status, statusResults.pass);
        } else if (result.status === 'fail') {
            resultToRuleResult(result, rules, result.status, statusResults.fail);
        } else if (result.status === 'unknown') {
            resultToRuleResult(result, rules, result.status, statusResults.unknown);
        }
        ruleIdsWithResultNodes.add(result.ruleId);
    }

    for (const rule of rules) {
        if (!ruleIdsWithResultNodes.has(rule.id)) {
            statusResults.inapplicable.push(createRuleResultWithoutNodes(rule));
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
        description: rule.id,
        url: rule.url,
        guidance: rule.guidance,
    };
}

function createRuleResultWithoutNodes(rule: UnifiedRule): UnifiedRuleResult {
    return {
        id: rule.id,
        status: 'inapplicable',
        nodes: [],
        description: rule.id,
        url: rule.url,
        guidance: rule.guidance,
    };
}

function getUnifiedRule(id: string, rules: UnifiedRule[]): UnifiedRule {
    return rules.find(rule => rule.id === id);
}
