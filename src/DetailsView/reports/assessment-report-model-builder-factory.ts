// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';

import { AssessmentReportModelBuilder } from './assessment-report-model-builder';

export class AssessmentReportModelBuilderFactory {
    public create(
        assessmentsProvider: AssessmentsProvider,
        assessmentStoreData: AssessmentStoreData,
        tabStoreData: TabStoreData,
        reportDate: Date,
        assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator,
    ): AssessmentReportModelBuilder {
        return new AssessmentReportModelBuilder(
            assessmentsProvider,
            assessmentStoreData,
            tabStoreData,
            reportDate,
            assessmentDefaultMessageGenerator,
        );
    }
}
