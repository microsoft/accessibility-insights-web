// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    GetAssessmentSummaryModelFromProviderAndStatusData,
    GetAssessmentSummaryModelFromProviderAndStoreData,
} from 'reports/get-assessment-summary-model';
import {
    GetQuickAssessSummaryModelFromProviderAndStatusData,
    GetQuickAssessSummaryModelFromProviderAndStoreData,
} from 'reports/get-quick-assess-summary-model';

export type GetSelectedAssessmentSummaryModelFromProviderAndStatusData =
    | GetQuickAssessSummaryModelFromProviderAndStatusData
    | GetAssessmentSummaryModelFromProviderAndStatusData;

export type GetSelectedAssessmentSummaryModelFromProviderAndStoreData =
    | GetAssessmentSummaryModelFromProviderAndStoreData
    | GetQuickAssessSummaryModelFromProviderAndStoreData;
