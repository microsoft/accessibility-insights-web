// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessment } from '../../assessments/types/iassessment';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { OutcomeStats, outcomeStatsFromManualTestStatus } from '../../DetailsView/reports/components/outcome-type';
import { IManualTestStatus } from '../types/manual-test-status';
import { IAssessmentData } from '../types/store-data/iassessment-result-data';
import { VisualizationType } from '../types/visualization-type';
import { getRequirementsResults, RequirementResult } from './requirement';

export type AssessmentTestDefinition = IAssessment;

export type AssessmentTestProviderDeps = {
    outcomeStatsFromManualTestStatus: (testStepStatus: IManualTestStatus) => OutcomeStats;
    getRequirementsResults: (provider: IAssessmentsProvider, type: VisualizationType, stepStatus: IManualTestStatus) => RequirementResult[];
};

const depDefaults = {
    outcomeStatsFromManualTestStatus,
    getRequirementsResults,
};

export class AssessmentTestResult {
    constructor(
        private readonly assessmentProvider: IAssessmentsProvider,
        public readonly type: VisualizationType,
        public readonly data: IAssessmentData,
        private readonly deps: AssessmentTestProviderDeps = depDefaults,
    ) {}

    public getRequirementResult(requirementKey: string): RequirementResult {
        return this.getRequirementResults().find(r => r.definition.key === requirementKey);
    }

    public getRequirementResults(): RequirementResult[] {
        return this.deps.getRequirementsResults(this.assessmentProvider, this.type, this.data.testStepStatus);
    }

    public getOutcomeStats(): OutcomeStats {
        return this.deps.outcomeStatsFromManualTestStatus(this.data.testStepStatus);
    }

    public get definition(): AssessmentTestDefinition {
        return this.assessmentProvider.forType(this.type);
    }
}
