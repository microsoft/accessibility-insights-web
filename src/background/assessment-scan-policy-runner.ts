// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { TestsEnabledState } from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { AssessmentStore } from './stores/assessment-store';
import { VisualizationStore } from './stores/visualization-store';

export type IScheduleScan = (test: VisualizationType, step: string, tabId: number) => void;
export type IIsAnAssessmentSelected = (testData: TestsEnabledState) => boolean;

export class AssessmentScanPolicyRunner {
    constructor(
        private assessmentStore: AssessmentStore,
        private visualizationStore: VisualizationStore,
        private scheduleScan: IScheduleScan,
        private assessmentProvider: AssessmentsProvider,
        private getSelectedAssessmentTest: IIsAnAssessmentSelected,
        private tabId: number,
    ) {}

    public beginListeningToStores(): void {
        this.assessmentStore.addChangedListener(this.onChange);
        this.visualizationStore.addChangedListener(this.onChange);
    }

    private onChange = () => {
        const visualizationState = this.visualizationStore.getState();
        const assessmentState = this.assessmentStore.getState();
        const selectedAssessment = this.getSelectedAssessmentTest(visualizationState.tests);

        if (
            assessmentState.persistedTabInfo == null ||
            this.tabId !== assessmentState.persistedTabInfo.id ||
            visualizationState.scanning != null ||
            selectedAssessment === false
        ) {
            return;
        }

        const assessmentConfig = this.assessmentProvider.forType(assessmentState.assessmentNavState.selectedTestType);
        const visualizationConfig = assessmentConfig.getVisualizationConfiguration();

        const scanStep = (step: string) => {
            this.scheduleScan(assessmentConfig.visualizationType, step, this.tabId);
        };

        assessmentConfig.executeAssessmentScanPolicy(scanStep, visualizationConfig.getAssessmentData(assessmentState));
    };
}
