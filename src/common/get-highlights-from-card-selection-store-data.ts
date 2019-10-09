// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap, forOwn, keys } from 'lodash';
import {
    CardSelectionStoreData,
    RuleExpandCollapseData,
    RuleExpandCollapseDataDictionary,
} from './types/store-data/card-selection-store-data';

// Returns an array of result uids indicating which results should be highlighted
export function getHighlightsFromCardSelectionStoreData(storeData: CardSelectionStoreData): string[] {
    if (!storeData) {
        return [];
    }

    const expandedRuleIds = getRuleIdsOfExpandedRules(storeData.rules);

    if (expandedRuleIds.length === 0) {
        return getAllResultUids(storeData.rules);
    }

    if (storeData.selectedCardCount === 0) {
        return getAllResultUidsFromRuleIdArray(storeData.rules, expandedRuleIds);
    }

    return getOnlyResultUidsFromSelectedCards(storeData.rules, expandedRuleIds);
}

function getRuleIdsOfExpandedRules(ruleDictionary: RuleExpandCollapseDataDictionary): string[] {
    if (!ruleDictionary) {
        return [];
    }

    const expandedRuleIds: string[] = [];

    forOwn(ruleDictionary, (rule, ruleId) => {
        if (rule.isExpanded) {
            expandedRuleIds.push(ruleId);
        }
    });

    return expandedRuleIds;
}

function getAllResultUids(ruleDictionary: RuleExpandCollapseDataDictionary): string[] {
    return getAllResultUidsFromRuleIdArray(ruleDictionary, keys(ruleDictionary));
}

function getAllResultUidsFromRuleIdArray(ruleDictionary: RuleExpandCollapseDataDictionary, ruleIds: string[]): string[] {
    return flatMap(ruleIds, key => getAllResultUidsFromRule(ruleDictionary[key]));
}

function getAllResultUidsFromRule(rule: RuleExpandCollapseData): string[] {
    return keys(rule.cards);
}

function getOnlyResultUidsFromSelectedCards(ruleDictionary: RuleExpandCollapseDataDictionary, ruleIds: string[]): string[] {
    return flatMap(ruleIds, key => getResultUidsFromSelectedCards(ruleDictionary[key]));
}

function getResultUidsFromSelectedCards(rule: RuleExpandCollapseData): string[] {
    const results: string[] = [];

    forOwn(rule.cards, (value, key) => {
        if (value) {
            results.push(key);
        }
    });

    return results;
}
