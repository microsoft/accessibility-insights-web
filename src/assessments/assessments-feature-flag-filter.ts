// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { AssessmentsProviderImpl } from './assessments-provider';
import { AssessmentsProvider } from './types/assessments-provider';
import { Assessment } from './types/iassessment';

function assessmentIsFeatureEnabled(flags: FeatureFlagStoreData): (assessment: Assessment) => boolean {
    return assessment =>
        !assessment.featureFlag || !assessment.featureFlag.required || _.every(assessment.featureFlag.required, f => flags[f]);
}

export type AssessmentsProviderWithFeaturesEnabled = (
    assessmentProvider: AssessmentsProvider,
    flags: FeatureFlagStoreData,
) => AssessmentsProvider;

export const assessmentsProviderWithFeaturesEnabled: AssessmentsProviderWithFeaturesEnabled = (
    assessmentProvider: AssessmentsProvider,
    flags: FeatureFlagStoreData,
) => AssessmentsProviderImpl.Create(assessmentProvider.all().filter(assessmentIsFeatureEnabled(flags)));
