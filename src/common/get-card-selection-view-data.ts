// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HighlightState } from 'common/components/cards/instance-details-footer';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { ResultsFilter } from 'common/types/results-filter';
import {
    UnifiedResult,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { flatMap, forOwn, intersection, isEmpty, keys } from 'lodash';

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

export type GetCardSelectionViewData = (
    storeData: CardSelectionStoreData,
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    isResultHighlightUnavailable: IsResultHighlightUnavailable,
    resultsFilter?: ResultsFilter,
) => CardSelectionViewData;

export const getCardSelectionViewData: GetCardSelectionViewData = (
    cardSelectionStoreData: CardSelectionStoreData,
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    isResultHighlightUnavailable: IsResultHighlightUnavailable,
    resultsFilter: ResultsFilter = _ => true,
): CardSelectionViewData => {
    const viewData = getEmptyViewData();

    if (isEmpty(cardSelectionStoreData) || unifiedScanResultStoreData?.results == null) {
        return viewData;
    }

    viewData.visualHelperEnabled = cardSelectionStoreData.visualHelperEnabled || false;
    viewData.expandedRuleIds = getRuleIdsOfExpandedRules(cardSelectionStoreData.rules);

    const filteredResults = unifiedScanResultStoreData.results.filter(resultsFilter);
    const filteredResultUids = filteredResults.map(res => res.uid);
    const allResultUids = getAllResultUids(filteredResultUids, cardSelectionStoreData.rules);

    const unavailableResultUids = getResultsWithUnavailableHighlightStatus(
        unifiedScanResultStoreData,
        isResultHighlightUnavailable,
    );
    let selectedResultUids = getOnlyResultUidsFromSelectedCards(
        cardSelectionStoreData.rules,
        viewData.expandedRuleIds,
        filteredResultUids,
    );
    let visibleResultUids: string[];

    if (!cardSelectionStoreData.visualHelperEnabled) {
        visibleResultUids = [];
        selectedResultUids = [];
    } else if (viewData.expandedRuleIds.length === 0) {
        visibleResultUids = allResultUids;
    } else if (selectedResultUids.length > 0) {
        visibleResultUids = selectedResultUids;
    } else {
        visibleResultUids = getFilteredResultUidsFromRuleIdArray(
            cardSelectionStoreData.rules,
            viewData.expandedRuleIds,
            filteredResultUids,
        );
    }

    viewData.selectedResultUids = selectedResultUids;
    viewData.resultsHighlightStatus = getHighlightStatusByResultUid(
        allResultUids,
        visibleResultUids,
        unavailableResultUids,
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

function getResultsWithUnavailableHighlightStatus(
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    isResultHighlightUnavailable: IsResultHighlightUnavailable,
): string[] {
    return unifiedScanResultStoreData.results
        .filter(
            result =>
                result.status === 'fail' &&
                isResultHighlightUnavailable(result, unifiedScanResultStoreData.platformInfo),
        )
        .map(result => result.uid);
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

function getAllResultUids(
    filteredResultUids: string[],
    ruleDictionary: RuleExpandCollapseDataDictionary,
): string[] {
    return getFilteredResultUidsFromRuleIdArray(
        ruleDictionary,
        keys(ruleDictionary),
        filteredResultUids,
    );
}

function getFilteredResultUidsFromRuleIdArray(
    ruleDictionary: RuleExpandCollapseDataDictionary,
    ruleIds: string[],
    filteredResultUids: string[],
): string[] {
    const allResultUids = flatMap(ruleIds, key => getAllResultUidsFromRule(ruleDictionary[key]));

    return intersection(filteredResultUids, allResultUids);
}

function getAllResultUidsFromRule(rule: RuleExpandCollapseData): string[] {
    return keys(rule.cards);
}

function getOnlyResultUidsFromSelectedCards(
    ruleDictionary: RuleExpandCollapseDataDictionary,
    ruleIds: string[],
    filteredResultUids: string[],
): string[] {
    const selectedResultUids = flatMap(ruleIds, key =>
        getResultUidsFromSelectedCards(ruleDictionary[key]),
    );

    return intersection(filteredResultUids, selectedResultUids);
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
    unavailableResultUids: string[],
): ResultsHighlightStatus {
    const result = {};
    for (const resultUid of allResultUids) {
        result[resultUid] = 'hidden';
    }
    for (const resultUid of visibleResultUids) {
        result[resultUid] = 'visible';
    }
    for (const resultUid of unavailableResultUids) {
        result[resultUid] = 'unavailable';
    }
    return result;
}
