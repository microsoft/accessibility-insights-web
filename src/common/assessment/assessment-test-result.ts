// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
import { Assessment } from '../../assessments/types/iassessment';
import { OutcomeStats, outcomeStatsFromManualTestStatus } from '../../DetailsView/reports/components/outcome-type';
import { ManualTestStatusData } from '../types/manual-test-status';
import { AssessmentData } from '../types/store-data/assessment-result-data';
import { VisualizationType } from '../types/visualization-type';
import { getRequirementsResults, RequirementResult } from './requirement';

export type AssessmentTestDefinition = Assessment;

export type AssessmentTestProviderDeps = {
    outcomeStatsFromManualTestStatus: (testStepStatus: ManualTestStatusData) => OutcomeStats;
    getRequirementsResults: (
        provider: AssessmentsProvider,
        visualizationType: VisualizationType,
        stepStatus: ManualTestStatusData,
    ) => RequirementResult[];
};

const depDefaults = {
    outcomeStatsFromManualTestStatus,
    getRequirementsResults,
};

export class AssessmentTestResult {
    constructor(
        private readonly assessmentProvider: AssessmentsProvider,
        public readonly visualizationType: VisualizationType,
        public readonly data: AssessmentData,
        private readonly deps: AssessmentTestProviderDeps = depDefaults,
    ) {}

    public getRequirementResult(requirementKey: string): RequirementResult {
        return this.getRequirementResults().find(r => r.definition.key === requirementKey);
    }

    public getRequirementResults(): RequirementResult[] {
        return this.deps.getRequirementsResults(this.assessmentProvider, this.visualizationType, this.data.testStepStatus);
    }

    public getOutcomeStats(): OutcomeStats {
        return this.deps.outcomeStatsFromManualTestStatus(this.data.testStepStatus);
    }

    public get definition(): AssessmentTestDefinition {
        return this.assessmentProvider.forType(this.visualizationType);
    }
}
