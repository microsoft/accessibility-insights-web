// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { GetDecoratedAxeNodeCallback } from 'injected/get-decorated-axe-node';
import { find, includes } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';

export interface CheckData {
    // tslint:disable-next-line: no-reserved-keywords
    any: FormattedCheckResult[];
    none: FormattedCheckResult[];
    all: FormattedCheckResult[];
}

export type GetElementBasedViewModelCallback = (
    rules: UnifiedRule[],
    results: UnifiedResult[],
    cardSelectionData: CardSelectionStoreData,
) => DictionaryStringTo<AssessmentVisualizationInstance>;

export type GetHighlightedResultInstanceIdsCallback = (
    cardSelectionData: CardSelectionStoreData,
) => Pick<CardSelectionViewData, 'highlightedResultUids'>;

export class ElementBasedViewModelCreator {
    constructor(
        private getDecoratedAxeNode: GetDecoratedAxeNodeCallback,
        private getHighlightedResultInstanceIds: GetHighlightedResultInstanceIdsCallback,
    ) {}

    public getElementBasedViewModel: GetElementBasedViewModelCallback = (
        rules: UnifiedRule[],
        results: UnifiedResult[],
        cardSelectionData: CardSelectionStoreData,
    ) => {
        if (rules == null || results == null || cardSelectionData == null) {
            return;
        }

        const resultDictionary: DictionaryStringTo<AssessmentVisualizationInstance> = {};
        const highlightedResultInstanceUids = this.getHighlightedResultInstanceIds(
            cardSelectionData,
        ).highlightedResultUids;

        results.forEach(unifiedResult => {
            if (
                unifiedResult.status !== 'fail' ||
                !includes(highlightedResultInstanceUids, unifiedResult.uid)
            ) {
                return;
            }

            const rule = find(
                rules,
                unifiedRule => unifiedRule.id === unifiedResult.ruleId,
            );

            const identifier = this.getIdentifier(unifiedResult);
            const decoratedResult = this.getDecoratedAxeNode(
                unifiedResult,
                rule,
                identifier,
            );
            const ruleResults = resultDictionary[identifier]
                ? resultDictionary[identifier].ruleResults
                : {};

            resultDictionary[identifier] = {
                isFailure: true,
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
