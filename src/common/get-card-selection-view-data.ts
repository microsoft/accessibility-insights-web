// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap, forOwn, keys } from 'lodash';
import {
    CardSelectionStoreData,
    RuleExpandCollapseData,
    RuleExpandCollapseDataDictionary,
} from './types/store-data/card-selection-store-data';

export interface CardSelectionViewData {
    highlightedResultUids: string[]; // page elements to highlight
    selectedResultUids: string[]; // indicates selected cards
    expandedRuleIds: string[];
}

export type GetCardSelectionViewData = (storeData: CardSelectionStoreData) => CardSelectionViewData;

export const getCardSelectionViewData: GetCardSelectionViewData = (storeData: CardSelectionStoreData): CardSelectionViewData => {
    const viewData = getEmptyViewData();

    if (!storeData) {
        return viewData;
    }

    viewData.expandedRuleIds = getRuleIdsOfExpandedRules(storeData.rules);

    if (viewData.expandedRuleIds.length === 0) {
        viewData.highlightedResultUids = getAllResultUids(storeData.rules);
        return viewData;
    }

    viewData.selectedResultUids = getOnlyResultUidsFromSelectedCards(storeData.rules, viewData.expandedRuleIds);

    viewData.highlightedResultUids = viewData.selectedResultUids.length
        ? viewData.selectedResultUids
        : getAllResultUidsFromRuleIdArray(storeData.rules, viewData.expandedRuleIds);

    return viewData;
};

function getEmptyViewData(): CardSelectionViewData {
    const viewData: CardSelectionViewData = {
        highlightedResultUids: [],
        selectedResultUids: [],
        expandedRuleIds: [],
    };

    return viewData;
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
