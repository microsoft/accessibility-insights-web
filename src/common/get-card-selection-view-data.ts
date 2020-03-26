// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HighlightState } from 'common/components/cards/instance-details-footer';
import {
    PlatformData,
    UnifiedResult,
    UnifiedScanResultStoreData,
    ViewPortProperties,
} from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
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
    visualHelperEnabled: boolean;
    resultHighlightStatus: { [resultUid: string]: HighlightState };
}

export type GetCardSelectionViewData = (
    storeData: CardSelectionStoreData,
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
) => CardSelectionViewData;

export const getCardSelectionViewData = (
    cardSelectionStoreData: CardSelectionStoreData,
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
): CardSelectionViewData => {
    const viewData = getEmptyViewData();

    if (!cardSelectionStoreData) {
        return viewData;
    }

    viewData.visualHelperEnabled = cardSelectionStoreData.visualHelperEnabled || false;
    viewData.expandedRuleIds = getRuleIdsOfExpandedRules(cardSelectionStoreData.rules);
    viewData.selectedResultUids = getOnlyResultUidsFromSelectedCards(
        cardSelectionStoreData.rules,
        viewData.expandedRuleIds,
    );

    unifiedScanResultStoreData.results
        .filter(result => result.status === 'fail')
        .forEach(result => {
            viewData.resultHighlightStatus[result.uid] = getUnavailableHighlightStatus(
                result,
                unifiedScanResultStoreData.platformInfo,
            );
        });

    if (!cardSelectionStoreData.visualHelperEnabled) {
        // no selected cards; no highlighted instances
        return viewData;
    }

    if (viewData.expandedRuleIds.length === 0) {
        forOwn(viewData.resultHighlightStatus, (status, resultUid) => {
            viewData.resultHighlightStatus[resultUid] = status || 'visible';
        });
        return viewData;
    }

    const allResultUids = getAllResultUids(cardSelectionStoreData.rules);

    if (viewData.selectedResultUids.length) {
        viewData.selectedResultUids.forEach(resultUid => {
            viewData.resultHighlightStatus[resultUid] =
                viewData.resultHighlightStatus[resultUid] || 'visible';
        });
        allResultUids.forEach(resultUid => {
            viewData.resultHighlightStatus[resultUid] =
                viewData.resultHighlightStatus[resultUid] || 'hidden';
        });
        return viewData;
    }

    const wouldBeHighlightedResults = getAllResultUidsFromRuleIdArray(
        cardSelectionStoreData.rules,
        viewData.expandedRuleIds,
    );

    wouldBeHighlightedResults.forEach(resultUid => {
        viewData.resultHighlightStatus[resultUid] =
            viewData.resultHighlightStatus[resultUid] || 'visible';
    });
    allResultUids.forEach(resultUid => {
        viewData.resultHighlightStatus[resultUid] =
            viewData.resultHighlightStatus[resultUid] || 'hidden';
    });

    return viewData;
};

function getEmptyViewData(): CardSelectionViewData {
    const viewData = {
        highlightedResultUids: [],
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultHighlightStatus: {},
    };

    return viewData;
}

const getUnavailableHighlightStatus: (
    result: UnifiedResult,
    platformInfo: PlatformData,
) => HighlightState = (result, platformInfo) => {
    if (
        !hasValidBoundingRectangle(result.descriptors.boundingRectangle, platformInfo.viewPortInfo)
    ) {
        return 'unavailable';
    }

    return null;
};

function hasValidBoundingRectangle(
    boundingRectangle: BoundingRectangle,
    viewPort: ViewPortProperties,
): boolean {
    return (
        boundingRectangle != null &&
        !(boundingRectangle.left > viewPort.width || boundingRectangle.top > viewPort.height)
    );
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
