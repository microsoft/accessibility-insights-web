// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';

import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';

export type AssessmentsRequirementsFilter = (
    assessmentsProvider: AssessmentsProvider,
    requirementKeys: string[],
) => AssessmentsProvider;

// the assessmentProvider passed into this function should already
// have been passed through the filter for feature flags
export function assessmentsProviderForRequirements(
    assessmentProvider: AssessmentsProvider,
    requirementKeys: string[],
): AssessmentsProvider {
    const assessments = assessmentProvider
        .all()
        .map(assessment => {
            return {
                ...assessment,
                requirements: assessment.requirements.filter(requirement =>
                    requirementKeys.includes(requirement.key),
                ),
            };
        })
        .filter(assessment => assessment.requirements.length > 0);
    assessments.unshift(AutomatedChecks);

    return AssessmentsProviderImpl.Create(assessments);
}
