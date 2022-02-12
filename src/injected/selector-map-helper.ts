// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { GetElementBasedViewModelCallback } from 'injected/element-based-view-model-creator';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { GetVisualizationInstancesForTabStops } from 'injected/visualization/get-visualization-instances-for-tab-stops';
import { includes } from 'lodash';
import { ManualTestStatus } from '../common/types/manual-test-status';
import { GeneratedAssessmentInstance } from '../common/types/store-data/assessment-result-data';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';

export type VisualizationRelatedStoreData = Pick<
    TargetPageStoreData,
    | 'assessmentStoreData'
    | 'unifiedScanResultStoreData'
    | 'visualizationScanResultStoreData'
    | 'cardSelectionStoreData'
    | 'needsReviewCardSelectionStoreData'
    | 'needsReviewScanResultStoreData'
    | 'featureFlagStoreData'
>;

export class SelectorMapHelper {
    constructor(
        private assessmentsProvider: AssessmentsProvider,
        private getElementBasedViewModel: GetElementBasedViewModelCallback,
        private getVisualizationInstancesForTabStops: typeof GetVisualizationInstancesForTabStops,
    ) {}

    public getSelectorMap(
        visualizationType: VisualizationType,
        stepKey: string,
        visualizationRelatedStoreData: VisualizationRelatedStoreData,
    ): SelectorToVisualizationMap {
        let selectorMap = {};
        const {
            visualizationScanResultStoreData,
            unifiedScanResultStoreData,
            assessmentStoreData,
            cardSelectionStoreData,
            needsReviewScanResultStoreData,
            needsReviewCardSelectionStoreData,
            featureFlagStoreData,
        } = visualizationRelatedStoreData;

        if (this.isAdHocVisualization(visualizationType)) {
            selectorMap = this.getAdHocVisualizationSelectorMap(
                visualizationType,
                visualizationScanResultStoreData,
                unifiedScanResultStoreData,
                cardSelectionStoreData,
                needsReviewScanResultStoreData,
                needsReviewCardSelectionStoreData,
                featureFlagStoreData,
            );
        }

        if (this.assessmentsProvider.isValidType(visualizationType)) {
            const key = this.assessmentsProvider.forType(visualizationType).key;
            selectorMap = this.getFilteredSelectorMap(
                assessmentStoreData.assessments[key].generatedAssessmentInstancesMap,
                stepKey,
            );
        }

        return selectorMap;
    }

    private isAdHocVisualization(visualizationType: VisualizationType): boolean {
        return includes(
            [
                VisualizationType.Issues,
                VisualizationType.Headings,
                VisualizationType.Landmarks,
                VisualizationType.TabStops,
                VisualizationType.Color,
                VisualizationType.NeedsReview,
            ],
            visualizationType,
        );
    }

    private getAdHocVisualizationSelectorMap(
        visualizationType: VisualizationType,
        visualizationScanResultData: VisualizationScanResultData,
        unifiedScanData: UnifiedScanResultStoreData,
        cardSelectionStoreData: CardSelectionStoreData,
        needsReviewScanData: NeedsReviewScanResultStoreData,
        needsReviewCardSelectionStoreData: NeedsReviewCardSelectionStoreData,
        featureFlagStoreData: FeatureFlagStoreData,
    ): SelectorToVisualizationMap {
        let selectorMap = {};
        switch (visualizationType) {
            case VisualizationType.NeedsReview:
                selectorMap = this.getElementBasedViewModel(
                    needsReviewScanData,
                    needsReviewCardSelectionStoreData,
                );
                break;
            case VisualizationType.Issues:
                selectorMap = this.getElementBasedViewModel(
                    unifiedScanData,
                    cardSelectionStoreData,
                );
                break;
            case VisualizationType.Headings:
                selectorMap = visualizationScanResultData.headings.fullAxeResultsMap;
                break;
            case VisualizationType.Landmarks:
                selectorMap = visualizationScanResultData.landmarks.fullAxeResultsMap;
                break;
            case VisualizationType.TabStops:
                selectorMap = visualizationScanResultData.tabStops.tabbedElements;
                if (featureFlagStoreData[FeatureFlags.tabStopsAutomation] === true) {
                    selectorMap = this.getVisualizationInstancesForTabStops(
                        visualizationScanResultData.tabStops,
                    );
                }
                break;
            default:
                selectorMap = visualizationScanResultData.color.fullAxeResultsMap;
                break;
        }

        return selectorMap;
    }

    private getFilteredSelectorMap(
        generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
        testStep: string,
    ): SelectorToVisualizationMap {
        if (generatedAssessmentInstancesMap == null) {
            return null;
        }

        const selectorMap: SelectorToVisualizationMap = {};
        Object.keys(generatedAssessmentInstancesMap).forEach(identifier => {
            const instance = generatedAssessmentInstancesMap[identifier];
            const stepResult = instance.testStepResults[testStep];
            if (stepResult != null) {
                selectorMap[identifier] = {
                    target: instance.target,
                    isFailure: stepResult.status === ManualTestStatus.FAIL,
                    isVisualizationEnabled: stepResult.isVisualizationEnabled,
                    propertyBag: instance.propertyBag,
                    ruleResults: null,
                };
            }
        });

        return selectorMap;
    }
}
