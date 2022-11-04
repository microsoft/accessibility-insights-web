// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';

import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';

export function assessmentsProviderForRequirements(
    assessmentProvider: AssessmentsProvider,
    featureFlags: FeatureFlagStoreData,
    requirementKeys: string[],
): AssessmentsProvider {
    const enabledFeaturesProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentProvider,
        featureFlags,
    );

    const assessments = enabledFeaturesProvider
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
