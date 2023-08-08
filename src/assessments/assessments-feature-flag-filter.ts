// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { every } from 'lodash';

import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';
import { Assessment } from './types/iassessment';

function assessmentIsFeatureEnabled(
    flags: FeatureFlagStoreData,
): (assessment: Assessment) => boolean {
    return assessment =>
        !assessment.featureFlag ||
        !assessment.featureFlag.required ||
        every(assessment.featureFlag.required, f => flags[f]);
}

export type AssessmentsFeatureFlagFilter = (
    assessmentsProvider: AssessmentsProvider,
    featureFlagStoreData: FeatureFlagStoreData,
) => AssessmentsProvider;

export function assessmentsProviderWithFeaturesEnabled(
    assessmentProvider: AssessmentsProvider,
    flags: FeatureFlagStoreData,
): AssessmentsProvider {
    return AssessmentsProviderImpl.Create(
        assessmentProvider.all().filter(assessmentIsFeatureEnabled(flags)),
    );
}
