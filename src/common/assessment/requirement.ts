// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { keys, sortBy } from 'lodash';

import { AssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { Requirement } from '../../assessments/types/requirement';
import { ManualTestStatusData, TestStepData } from '../types/manual-test-status';
import { VisualizationType } from '../types/visualization-type';

export type RequirementDefinition = Requirement;
export type RequirementData = TestStepData;

export type RequirementResult = {
    definition: RequirementDefinition;
    data: RequirementData;
};
export type RequirementOrdering = RequirementOrderPart | RequirementOrderPart[];
export type RequirementOrderPart = (result: RequirementResult) => string | number;

export function getRequirementsResults(
    provider: AssessmentsProvider,
    type: VisualizationType,
    stepStatus: ManualTestStatusData,
): RequirementResult[] {
    const test = provider.forType(type);

    function result(key): RequirementResult {
        const definition = provider.getStep(type, key);
        const data = stepStatus[key];
        return { definition, data };
    }

    const unsorted = keys(stepStatus).map(result);

    return sortBy(unsorted, test.requirementOrder);
}
