// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as _ from 'lodash';

import { FeatureFlags } from 'common/feature-flags';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { getElementBasedViewModel } from 'injected/frameCommunicators/unified-result-to-old-instance';
import { ManualTestStatus } from '../common/types/manual-test-status';
import { AssessmentStoreData, GeneratedAssessmentInstance } from '../common/types/store-data/assessment-result-data';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';

export class SelectorMapHelper {
    private assessmentsProvider: AssessmentsProvider;

    constructor(assessmentsProvider: AssessmentsProvider) {
        this.assessmentsProvider = assessmentsProvider;
    }

    public getSelectorMap(
        visualizationType: VisualizationType,
        visualizationScanResultData: VisualizationScanResultData,
        assessmentState: AssessmentStoreData,
        unifiedScanData: UnifiedScanResultStoreData,
        featureFlagData: FeatureFlagStoreData,
    ): DictionaryStringTo<AssessmentVisualizationInstance> {
        let selectorMap = {};

        if (this.isAdHocVisualization(visualizationType)) {
            selectorMap = this.getAdHocVisualizationSelectorMap(
                visualizationType,
                visualizationScanResultData,
                unifiedScanData,
                featureFlagData,
            );
        }

        if (this.assessmentsProvider.isValidType(visualizationType)) {
            const key = this.assessmentsProvider.forType(visualizationType).key;
            selectorMap = this.getFilteredSelectorMap(
                assessmentState.assessments[key].generatedAssessmentInstancesMap,
                assessmentState.assessmentNavState.selectedTestStep,
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
    ): DictionaryStringTo<AssessmentVisualizationInstance> {
        let selectorMap = {};
        switch (visualizationType) {
            case VisualizationType.Issues:
                if (featureFlagData[FeatureFlags.universalCardsUI] === true) {
                    selectorMap = getElementBasedViewModel(unifiedScanData.rules, unifiedScanData.results, []);
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
                    html: instance.html,
                    propertyBag: instance.propertyBag,
                    identifier: identifier,
                    ruleResults: null,
                };
            }
        });

        return selectorMap;
    }
}
