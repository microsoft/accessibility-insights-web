// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { GetElementBasedViewModelCallback } from 'injected/element-based-view-model-creator';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { GetVisualizationInstancesForTabStops } from 'injected/visualization/get-visualization-instances-for-tab-stops';
import { includes } from 'lodash';
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
    | 'assessmentCardSelectionStoreData'
>;

export class SelectorMapHelper {
    constructor(
        private visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private getElementBasedViewModel: GetElementBasedViewModelCallback,
        private getVisualizationInstancesForTabStops: typeof GetVisualizationInstancesForTabStops,
    ) {}

    public getSelectorMap(
        visualizationType: VisualizationType,
        stepKey: string,
        visualizationRelatedStoreData: VisualizationRelatedStoreData,
    ): SelectorToVisualizationMap {
        const {
            visualizationScanResultStoreData,
            unifiedScanResultStoreData,
            assessmentStoreData,
            cardSelectionStoreData,
            needsReviewScanResultStoreData,
            needsReviewCardSelectionStoreData,
            assessmentCardSelectionStoreData,
        } = visualizationRelatedStoreData;

        if (this.isAdHocVisualization(visualizationType)) {
            return this.getAdHocVisualizationSelectorMap(
                visualizationType,
                visualizationScanResultStoreData,
                unifiedScanResultStoreData,
                cardSelectionStoreData,
                needsReviewScanResultStoreData,
                needsReviewCardSelectionStoreData,
            );
        }

        if (stepKey === AutomatedChecks.key) {
            return this.getElementBasedViewModel(
                assessmentStoreData,
                assessmentCardSelectionStoreData
                    ? assessmentCardSelectionStoreData[visualizationType]
                    : null,
            );
        }

        const assessmentData = this.visualizationConfigurationFactory
            .getConfiguration(visualizationType)
            .getAssessmentData(assessmentStoreData);

        return this.getFilteredSelectorMap(
            assessmentData?.generatedAssessmentInstancesMap,
            stepKey,
        );
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
                VisualizationType.AccessibleNames,
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
                selectorMap = this.getVisualizationInstancesForTabStops(
                    visualizationScanResultData.tabStops,
                );
                break;
            case VisualizationType.AccessibleNames:
                selectorMap = visualizationScanResultData.accessibleNames.fullAxeResultsMap;
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
