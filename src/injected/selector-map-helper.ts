// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { BaseStore } from '../common/base-store';
import { ManualTestStatus } from '../common/types/manual-test-status';
import { AssessmentStoreData, GeneratedAssessmentInstance } from '../common/types/store-data/assessment-result-data';
import { VisualizationScanResultData } from '../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryStringTo } from '../types/common-types';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';

export class SelectorMapHelper {
    private scanResultStore: BaseStore<VisualizationScanResultData>;
    private assessmentStore: BaseStore<AssessmentStoreData>;
    private assessmentsProvider: AssessmentsProvider;

    constructor(
        scanResultStore: BaseStore<VisualizationScanResultData>,
        assessmentStore: BaseStore<AssessmentStoreData>,
        assessmentsProvider: AssessmentsProvider,
    ) {
        this.scanResultStore = scanResultStore;
        this.assessmentStore = assessmentStore;
        this.assessmentsProvider = assessmentsProvider;
    }

    public getSelectorMap(visualizationType: VisualizationType): DictionaryStringTo<AssessmentVisualizationInstance> {
        let selectorMap = {};

        if (this.isAdHocVisualization(visualizationType)) {
            selectorMap = this.getAdHocVisualizationSelectorMap(visualizationType);
        }

        if (this.assessmentsProvider.isValidType(visualizationType)) {
            const key = this.assessmentsProvider.forType(visualizationType).key;
            const assessmentState = this.assessmentStore.getState();
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

    private getAdHocVisualizationSelectorMap(visualizationType: VisualizationType): DictionaryStringTo<AssessmentVisualizationInstance> {
        let selectorMap = {};
        const visulizaitonScanResultState = this.scanResultStore.getState();

        switch (visualizationType) {
            case VisualizationType.Issues:
                selectorMap = visulizaitonScanResultState.issues.selectedAxeResultsMap;
                break;
            case VisualizationType.Headings:
                selectorMap = visulizaitonScanResultState.headings.fullAxeResultsMap;
                break;
            case VisualizationType.Landmarks:
                selectorMap = visulizaitonScanResultState.landmarks.fullAxeResultsMap;
                break;
            case VisualizationType.TabStops:
                selectorMap = visulizaitonScanResultState.tabStops.tabbedElements;
                break;
            default:
                selectorMap = visulizaitonScanResultState.color.fullAxeResultsMap;
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
                    isVisible: stepResult.isVisible,
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
