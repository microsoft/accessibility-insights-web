// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { GetElementBasedViewModelCallback } from 'injected/element-based-view-model-creator';
import * as _ from 'lodash';

import { ManualTestStatus } from '../common/types/manual-test-status';
import { GeneratedAssessmentInstance } from '../common/types/store-data/assessment-result-data';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';

export type VisualizationRelatedStoreData = Pick<
    TargetPageStoreData,
    | 'assessmentStoreData'
    | 'featureFlagStoreData'
    | 'unifiedScanResultStoreData'
    | 'visualizationScanResultStoreData'
    | 'cardSelectionStoreData'
>;

export class SelectorMapHelper {
    constructor(private assessmentsProvider: AssessmentsProvider, private getElementBasedViewModel: GetElementBasedViewModelCallback) {}

    public getSelectorMap(
        visualizationType: VisualizationType,
        visualizationRelatedStoreData: VisualizationRelatedStoreData,
    ): DictionaryStringTo<AssessmentVisualizationInstance> {
        let selectorMap = {};
        const {
            visualizationScanResultStoreData,
            unifiedScanResultStoreData,
            featureFlagStoreData,
            assessmentStoreData,
            cardSelectionStoreData,
        } = visualizationRelatedStoreData;

        if (this.isAdHocVisualization(visualizationType)) {
            selectorMap = this.getAdHocVisualizationSelectorMap(
                visualizationType,
                visualizationScanResultStoreData,
                unifiedScanResultStoreData,
                featureFlagStoreData,
                cardSelectionStoreData,
            );
        }

        if (this.assessmentsProvider.isValidType(visualizationType)) {
            const key = this.assessmentsProvider.forType(visualizationType).key;
            selectorMap = this.getFilteredSelectorMap(
                assessmentStoreData.assessments[key].generatedAssessmentInstancesMap,
                assessmentStoreData.assessmentNavState.selectedTestStep,
            );
        }

        return selectorMap;
    }

    private isAdHocVisualization(visualizationType: VisualizationType): boolean {
        return _.includes(
            [
                VisualizationType.Issues,
                VisualizationType.Headings,
                VisualizationType.Landmarks,
                VisualizationType.TabStops,
                VisualizationType.Color,
            ],
            visualizationType,
        );
    }

    private getAdHocVisualizationSelectorMap(
        visualizationType: VisualizationType,
        visualizationScanResultData: VisualizationScanResultData,
        unifiedScanData: UnifiedScanResultStoreData,
        featureFlagData: FeatureFlagStoreData,
        cardSelectionStoreData: CardSelectionStoreData,
    ): DictionaryStringTo<AssessmentVisualizationInstance> {
        let selectorMap = {};
        switch (visualizationType) {
            case VisualizationType.Issues:
                if (featureFlagData[FeatureFlags.universalCardsUI] === true) {
                    selectorMap = this.getElementBasedViewModel(unifiedScanData.rules, unifiedScanData.results, cardSelectionStoreData);
                } else {
                    selectorMap = visualizationScanResultData.issues.selectedAxeResultsMap;
                }
                break;
            case VisualizationType.Headings:
                selectorMap = visualizationScanResultData.headings.fullAxeResultsMap;
                break;
            case VisualizationType.Landmarks:
                selectorMap = visualizationScanResultData.landmarks.fullAxeResultsMap;
                break;
            case VisualizationType.TabStops:
                selectorMap = visualizationScanResultData.tabStops.tabbedElements;
                break;
            default:
                selectorMap = visualizationScanResultData.color.fullAxeResultsMap;
                break;
        }

        return selectorMap;
    }

    private getFilteredSelectorMap<T, K>(
        generatedAssessmentInstancesMap: DictionaryStringTo<GeneratedAssessmentInstance<T, K>>,
        testStep: string,
    ): DictionaryStringTo<AssessmentVisualizationInstance> {
        if (generatedAssessmentInstancesMap == null) {
            return null;
        }

        const selectorMap: DictionaryStringTo<AssessmentVisualizationInstance> = {};
        Object.keys(generatedAssessmentInstancesMap).forEach(identifier => {
            const instance = generatedAssessmentInstancesMap[identifier];
            const stepResult = instance.testStepResults[testStep as keyof K];
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
