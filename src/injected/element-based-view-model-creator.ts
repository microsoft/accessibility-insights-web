// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetCardSelectionViewData } from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    UnifiedResult,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { GetDecoratedAxeNodeCallback } from 'injected/get-decorated-axe-node';
import { find } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';

export interface CheckData {
    // tslint:disable-next-line: no-reserved-keywords
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
}

export type GetElementBasedViewModelCallback = (
    unifiedScanResultStoreData: UnifiedScanResultStoreData,
    cardSelectionData: CardSelectionStoreData,
) => DictionaryStringTo<AssessmentVisualizationInstance>;

export class ElementBasedViewModelCreator {
    constructor(
        private getDecoratedAxeNode: GetDecoratedAxeNodeCallback,
        private getHighlightedResultInstanceIds: GetCardSelectionViewData,
        private isResultHighlightUnavailable: IsResultHighlightUnavailable,
    ) {}

    public getElementBasedViewModel: GetElementBasedViewModelCallback = (
        unifiedScanResultStoreData,
        cardSelectionData,
    ) => {
        const { rules, results } = unifiedScanResultStoreData;
        if (rules == null || results == null || cardSelectionData == null) {
            return;
        }

        const resultDictionary: DictionaryStringTo<AssessmentVisualizationInstance> = {};
        const resultsHighlightStatus = this.getHighlightedResultInstanceIds(
            cardSelectionData,
            unifiedScanResultStoreData,
            this.isResultHighlightUnavailable,
        ).resultsHighlightStatus;

        results.forEach(unifiedResult => {
            if (resultsHighlightStatus[unifiedResult.uid] !== 'visible') {
                return;
            }

            const rule = find(rules, unifiedRule => unifiedRule.id === unifiedResult.ruleId);

            const identifier = this.getIdentifier(unifiedResult);
            const decoratedResult = this.getDecoratedAxeNode(unifiedResult, rule, identifier);
            const ruleResults = resultDictionary[identifier]
                ? resultDictionary[identifier].ruleResults
                : {};

            resultDictionary[identifier] = {
                isFailure: unifiedResult.status === 'fail',
                isVisualizationEnabled: true,
                target: this.getTarget(unifiedResult),
                ruleResults: {
                    ...ruleResults,
                    [rule.id]: decoratedResult,
                },
            };
        });

        return resultDictionary;
    };

    private getTarget(unifiedResult: UnifiedResult): string[] {
        return unifiedResult.identifiers['css-selector'].split(';');
    }

    private getIdentifier(unifiedResult: UnifiedResult): string {
        return unifiedResult.identifiers['css-selector'];
    }
}
