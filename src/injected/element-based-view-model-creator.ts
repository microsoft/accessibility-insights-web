// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { GetCardSelectionViewData } from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import {
    ConvertStoreDataForScanNodeResultsCallback,
    ScanNodeResult,
} from 'common/store-data-to-scan-node-result-converter';
import { TargetHelper } from 'common/target-helper';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    PlatformData,
    UnifiedResult,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { GetDecoratedAxeNodeCallback } from 'injected/get-decorated-axe-node';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { Target } from 'scanner/iruleresults';

export type GetElementBasedViewModelCallback = (
    storeData: UnifiedScanResultStoreData | AssessmentStoreData | null,
    cardSelectionData: CardSelectionStoreData,
) => SelectorToVisualizationMap | null;

export class ElementBasedViewModelCreator {
    constructor(
        private getDecoratedAxeNode: GetDecoratedAxeNodeCallback,
        private getHighlightedResultInstanceIds: GetCardSelectionViewData,
        private isResultHighlightUnavailable: IsResultHighlightUnavailable,
        private convertStoreDataForScanNodeResults: ConvertStoreDataForScanNodeResultsCallback,
    ) {}

    public getElementBasedViewModel: GetElementBasedViewModelCallback = (
        storeData: UnifiedScanResultStoreData | AssessmentStoreData | null,
        cardSelectionData: CardSelectionStoreData,
    ) => {
        const results: ScanNodeResult[] | null = this.convertStoreDataForScanNodeResults(
            storeData,
            cardSelectionData,
        );

        if (results == null || cardSelectionData?.rules == null) {
            return null;
        }

        return this.getSelectorToVisualizationMap(
            cardSelectionData,
            results,
            storeData && 'platformInfo' in storeData && storeData.platformInfo
                ? storeData.platformInfo
                : null,
        );
    };

    private getSelectorToVisualizationMap(
        cardSelectionData: CardSelectionStoreData,
        results: ScanNodeResult[],
        platformInfo: PlatformData | null,
    ): SelectorToVisualizationMap {
        const resultDictionary: SelectorToVisualizationMap = {};
        const resultsHighlightStatus = this.getHighlightedResultInstanceIds(
            cardSelectionData,
            results,
            platformInfo,
            this.isResultHighlightUnavailable,
        ).resultsHighlightStatus;

        results.forEach(result => {
            if (resultsHighlightStatus[result.uid] !== 'visible') {
                return null;
            }

            const identifier = this.getIdentifier(result);
            const decoratedResult = this.getDecoratedAxeNode(result, result.rule, identifier);
            const ruleResults = resultDictionary[identifier]
                ? resultDictionary[identifier].ruleResults
                : {};

            resultDictionary[identifier] = {
                isFailure: result.status === 'fail',
                isVisualizationEnabled: true,
                target: this.getTarget(result),
                ruleResults: {
                    ...ruleResults,
                    [result.ruleId]: decoratedResult,
                },
            };
        });

        return resultDictionary;
    }

    private getTarget(unifiedResult: UnifiedResult): Target {
        return unifiedResult.identifiers.target
            ? unifiedResult.identifiers.target
            : TargetHelper.getTargetFromSelector(unifiedResult.identifiers['css-selector'])!;
    }

    private getIdentifier(unifiedResult: UnifiedResult): string {
        return unifiedResult.identifiers['css-selector'];
    }
}
