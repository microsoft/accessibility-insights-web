// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { AssessmentsProvider } from './assessments-provider';
import { IAssessment } from './types/iassessment';
import { IAssessmentsProvider } from './types/iassessments-provider';

function assessmentIsFeatureEnabled(flags: FeatureFlagStoreData): (assessment: IAssessment) => boolean {
    return assessment =>
        !assessment.featureFlag || !assessment.featureFlag.required || _.every(assessment.featureFlag.required, f => flags[f]);
}

export function assessmentsProviderWithFeaturesEnabled(
    assessmentProvider: IAssessmentsProvider,
    flags: FeatureFlagStoreData,
): IAssessmentsProvider {
    return AssessmentsProvider.Create(assessmentProvider.all().filter(assessmentIsFeatureEnabled(flags)));
}
