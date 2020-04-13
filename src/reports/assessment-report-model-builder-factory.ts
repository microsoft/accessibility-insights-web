// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';

import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { AssessmentReportModelBuilder } from './assessment-report-model-builder';

export class AssessmentReportModelBuilderFactory {
    public create(
        assessmentsProvider: AssessmentsProvider,
        assessmentStoreData: AssessmentStoreData,
        scanTargetData: TargetAppData,
        reportDate: Date,
        assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator,
    ): AssessmentReportModelBuilder {
        return new AssessmentReportModelBuilder(
            assessmentsProvider,
            assessmentStoreData,
            scanTargetData,
            reportDate,
            assessmentDefaultMessageGenerator,
        );
    }
}
