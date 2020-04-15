// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HighlightState } from 'common/components/cards/instance-details-footer';
import { GetUnavailableHighlightStatus } from 'common/get-unavailable-highlight-status';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { flatMap, forOwn, isEmpty, keys } from 'lodash';

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
    getUnavailableHighlightStatus: GetUnavailableHighlightStatus,
) => CardSelectionViewData;

export const getCardSelectionViewData: GetCardSelectionViewData = (
    cardSelectionStoreData: CardSelectionStoreData,
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    getUnavailableHighlightStatus: GetUnavailableHighlightStatus,
): CardSelectionViewData => {
    const viewData = getEmptyViewData();

    if (
        isEmpty(cardSelectionStoreData) ||
        isEmpty(unifiedScanResultStoreData) ||
        unifiedScanResultStoreData.results == null
    ) {
        return viewData;
    }

    viewData.visualHelperEnabled = cardSelectionStoreData.visualHelperEnabled || false;
    viewData.expandedRuleIds = getRuleIdsOfExpandedRules(cardSelectionStoreData.rules);

    const allResultUids = getAllResultUids(cardSelectionStoreData.rules);
    const resultsWithUnavailableHighlightStatus = getResultsWithUnavailableHighlightStatus(
        unifiedScanResultStoreData,
        getUnavailableHighlightStatus,
    );

    allResultUids.forEach(resultUid => {
        viewData.resultsHighlightStatus[resultUid] = 'hidden';
    });

    if (!cardSelectionStoreData.visualHelperEnabled) {
        // no selected cards; no highlighted instances and unavailable instances shown as such.
        viewData.resultsHighlightStatus = {
            ...viewData.resultsHighlightStatus,
            ...resultsWithUnavailableHighlightStatus,
        };
        return viewData;
    }

    // if no rules are expanded, highlight all results except for those unavailable.
    if (viewData.expandedRuleIds.length === 0) {
        forOwn(viewData.resultsHighlightStatus, (_, resultUid) => {
            viewData.resultsHighlightStatus[resultUid] = 'visible';
        });
        viewData.resultsHighlightStatus = {
            ...viewData.resultsHighlightStatus,
            ...resultsWithUnavailableHighlightStatus,
        };
        return viewData;
    }

    // if there are any cards selected, make sure they are highlighted if not unavailable.
    viewData.selectedResultUids = getOnlyResultUidsFromSelectedCards(
        cardSelectionStoreData.rules,
        viewData.expandedRuleIds,
    );

    if (viewData.selectedResultUids.length > 0) {
        viewData.selectedResultUids.forEach(resultUid => {
            viewData.resultsHighlightStatus[resultUid] = 'visible';
        });
        viewData.resultsHighlightStatus = {
            ...viewData.resultsHighlightStatus,
            ...resultsWithUnavailableHighlightStatus,
        };
        return viewData;
    }

    // highlight all cards under expanded rules if no cards are selected if not unavailable.
    const wouldBeHighlightedResults = getAllResultUidsFromRuleIdArray(
        cardSelectionStoreData.rules,
        viewData.expandedRuleIds,
    );

    wouldBeHighlightedResults.forEach(resultUid => {
        viewData.resultsHighlightStatus[resultUid] = 'visible';
    });

    viewData.resultsHighlightStatus = {
        ...viewData.resultsHighlightStatus,
        ...resultsWithUnavailableHighlightStatus,
    };
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
    getUnavailableHighlightStatus: GetUnavailableHighlightStatus,
): ResultsHighlightStatus {
    const resultsWithUnavailableHighlightStatus = {};

    unifiedScanResultStoreData.results.forEach(result => {
        if (result.status !== 'fail') {
            return;
        }

        const unavailableHighlightStatus = getUnavailableHighlightStatus(
            result,
            unifiedScanResultStoreData.platformInfo,
        );

        if (unavailableHighlightStatus == null) {
            return;
        }

        resultsWithUnavailableHighlightStatus[result.uid] = unavailableHighlightStatus;
    });

    return resultsWithUnavailableHighlightStatus;
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

function getAllResultUidsFromRuleIdArray(
    ruleDictionary: RuleExpandCollapseDataDictionary,
    ruleIds: string[],
): string[] {
    return flatMap(ruleIds, key => getAllResultUidsFromRule(ruleDictionary[key]));
}

function getAllResultUidsFromRule(rule: RuleExpandCollapseData): string[] {
    return keys(rule.cards);
}

function getOnlyResultUidsFromSelectedCards(
    ruleDictionary: RuleExpandCollapseDataDictionary,
    ruleIds: string[],
): string[] {
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
