// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import {
    convertStoreDataForScanNodeResults,
    ConvertStoreDataForScanNodeResultsCallback,
    ScanNodeResult,
} from 'common/store-data-to-scan-node-result-converter';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { includes } from 'lodash';

import {
    AllRuleResultStatuses,
    CardResult,
    CardRuleResult,
    CardRuleResultsByStatus,
    CardRuleResultStatus,
    CardsViewModel,
    HighlightState,
} from './types/store-data/card-view-model';
import { UnifiedRule, UnifiedScanResultStoreData } from './types/store-data/unified-data-interface';

export type GetCardViewData = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData,
    cardSelectionViewData: CardSelectionViewData,
    getStoreDataForScanNodeResults?: ConvertStoreDataForScanNodeResultsCallback,
) => CardsViewModel | null;

export const getCardViewData: GetCardViewData = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData,
    cardSelectionViewData: CardSelectionViewData,
    getStoreDataForScanNodeResults: ConvertStoreDataForScanNodeResultsCallback = convertStoreDataForScanNodeResults,
): CardsViewModel | null => {
    const results: ScanNodeResult[] | null = getStoreDataForScanNodeResults(storeData);
    if (results == null || cardSelectionViewData == null) {
        return null;
    }
    return getCardViewDataFromScanNodeResults(
        results,
        cardSelectionViewData,
        'rules' in storeData && storeData.rules ? storeData.rules : undefined,
    );
};

const getCardViewDataFromScanNodeResults = (
    results: ScanNodeResult[],
    cardSelectionViewData: CardSelectionViewData,
    rules?: UnifiedRule[],
): CardsViewModel | null => {
    const statusResults = getEmptyStatusResults();
    const ruleIdsWithResultNodes: Set<string> = new Set();

    for (const result of results) {
        const ruleResults = statusResults[result.status];
        const isInstanceDisplayed = result.status === 'fail' || result.status === 'unknown';
        let ruleResult = getExistingRuleFromResults(result.ruleId, ruleResults);

        if (ruleResult == null) {
            const isExpanded = isInstanceDisplayed
                ? includes(cardSelectionViewData.expandedRuleIds, result.ruleId)
                : false;

            ruleResult = createCardRuleResult(result.status, result.rule, isExpanded);
            ruleResults.push(ruleResult);
        }

        const isSelected = isInstanceDisplayed
            ? includes(cardSelectionViewData.selectedResultUids, result.uid)
            : false;
        const highlightStatus = cardSelectionViewData.resultsHighlightStatus[result.uid];

        ruleResult.nodes.push(createCardResult(result, isSelected, highlightStatus));

        ruleIdsWithResultNodes.add(result.ruleId);
    }

    if (rules) {
        for (const rule of rules) {
            if (!ruleIdsWithResultNodes.has(rule.id)) {
                statusResults.inapplicable.push(createRuleResultWithoutNodes('inapplicable', rule));
            }
        }
    }

    return {
        cards: statusResults,
        visualHelperEnabled: cardSelectionViewData.visualHelperEnabled,
        allCardsCollapsed: cardSelectionViewData.expandedRuleIds.length === 0,
    };
};

const getExistingRuleFromResults = (
    ruleId: string,
    ruleResults: CardRuleResult[],
): CardRuleResult | null => {
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

const createCardRuleResult = (
    status: string,
    rule: UnifiedRule,
    isExpanded: boolean,
): CardRuleResult => ({
    id: rule.id,
    status: status,
    nodes: [],
    description: rule.description,
    url: rule.url,
    guidance: rule.guidance,
    isExpanded: isExpanded,
});

const createRuleResultWithoutNodes = (
    status: CardRuleResultStatus,
    rule: UnifiedRule,
): CardRuleResult => ({
    id: rule.id,
    status: status,
    nodes: [],
    description: rule.description,
    url: rule.url,
    guidance: rule.guidance,
    isExpanded: false,
});

const createCardResult = (
    result: ScanNodeResult,
    isSelected: boolean,
    highlightStatus: HighlightState,
): CardResult => {
    return {
        ...result,
        isSelected,
        highlightStatus,
    };
};

const getRuleResultIndex = (ruleId: string, ruleResults: CardRuleResult[]): number =>
    ruleResults.findIndex(result => result.id === ruleId);
