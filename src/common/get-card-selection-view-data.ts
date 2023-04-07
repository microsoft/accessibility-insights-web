// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultsFilter } from 'common/types/results-filter';
import { HighlightState } from 'common/types/store-data/card-view-model';
import { PlatformData, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { flatMap, forOwn, intersection, keys } from 'lodash';

import {
    CardSelectionStoreData,
    RuleExpandCollapseData,
    RuleExpandCollapseDataDictionary,
} from './types/store-data/card-selection-store-data';

export interface CardSelectionViewData {
    selectedResultUids: string[]; // indicates selected cards
    expandedRuleIds: string[];
    visualHelperEnabled: boolean;
    resultsHighlightStatus: ResultsHighlightStatus;
}

export type ResultsHighlightStatus = { [resultUid: string]: HighlightState };

export type FilterableResult = Pick<UnifiedResult, 'status' | 'uid' | 'descriptors'>;

export type GetCardSelectionViewData = (
    storeData: CardSelectionStoreData | null,
    results: FilterableResult[],
    platformInfo: PlatformData | null,
    resultsFilter?: ResultsFilter,
) => CardSelectionViewData;

export const getCardSelectionViewData: GetCardSelectionViewData = (
    cardSelectionStoreData: CardSelectionStoreData | null,
    results: FilterableResult[],
    platformInfo: PlatformData | null,
    resultsFilter: ResultsFilter = _ => true,
): CardSelectionViewData => {
    const viewData = getEmptyViewData();

    if (cardSelectionStoreData?.rules == null || results == null) {
        return viewData;
    }

    viewData.visualHelperEnabled = cardSelectionStoreData.visualHelperEnabled || false;
    viewData.expandedRuleIds = getRuleIdsOfExpandedRules(cardSelectionStoreData.rules);

    const candidateResults = results.filter(resultsFilter);
    const candidateResultUids = candidateResults.map(res => res.uid);
    const allFilteredUids = getAllFilteredUids(candidateResultUids, cardSelectionStoreData.rules);

    let selectedResultUids = getOnlyResultUidsFromSelectedCards(
        cardSelectionStoreData.rules,
        viewData.expandedRuleIds,
        candidateResultUids,
    );
    let visibleResultUids: string[];

    if (!cardSelectionStoreData.visualHelperEnabled) {
        visibleResultUids = [];
        selectedResultUids = [];
    } else if (viewData.expandedRuleIds.length === 0) {
        visibleResultUids = allFilteredUids;
    } else if (selectedResultUids.length > 0) {
        visibleResultUids = selectedResultUids;
    } else {
        visibleResultUids = getFilteredResultUidsFromRuleIdArray(
            cardSelectionStoreData.rules,
            viewData.expandedRuleIds,
            candidateResultUids,
        );
    }

    viewData.selectedResultUids = selectedResultUids;
    viewData.resultsHighlightStatus = getHighlightStatusByResultUid(
        allFilteredUids,
        visibleResultUids,
    );

    return viewData;
};

function getEmptyViewData(): CardSelectionViewData {
    return {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };
}

function getRuleIdsOfExpandedRules(ruleDictionary: RuleExpandCollapseDataDictionary): string[] {
    const expandedRuleIds: string[] = [];

    forOwn(ruleDictionary, (rule, ruleId) => {
        if (rule.isExpanded) {
            expandedRuleIds.push(ruleId);
        }
    });

    return expandedRuleIds;
}

function getAllFilteredUids(
    candidateResultUids: string[],
    ruleDictionary: RuleExpandCollapseDataDictionary,
): string[] {
    return getFilteredResultUidsFromRuleIdArray(
        ruleDictionary,
        keys(ruleDictionary),
        candidateResultUids,
    );
}

function getFilteredResultUidsFromRuleIdArray(
    ruleDictionary: RuleExpandCollapseDataDictionary,
    ruleIds: string[],
    candidateResultUids: string[],
): string[] {
    const allResultUids = flatMap(ruleIds, key => getAllResultUidsFromRule(ruleDictionary[key]));

    return intersection(candidateResultUids, allResultUids);
}

function getAllResultUidsFromRule(rule: RuleExpandCollapseData): string[] {
    return keys(rule.cards);
}

function getOnlyResultUidsFromSelectedCards(
    ruleDictionary: RuleExpandCollapseDataDictionary,
    ruleIds: string[],
    candidateResultUids: string[],
): string[] {
    const selectedResultUids = flatMap(ruleIds, key =>
        getResultUidsFromSelectedCards(ruleDictionary[key]),
    );

    return intersection(candidateResultUids, selectedResultUids);
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

function getHighlightStatusByResultUid(
    allResultUids: string[],
    visibleResultUids: string[],
): ResultsHighlightStatus {
    const result = {};
    for (const resultUid of allResultUids) {
        result[resultUid] = 'hidden';
    }
    for (const resultUid of visibleResultUids) {
        result[resultUid] = 'visible';
    }
    return result;
}
