// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from '../../assessments/assessment-default-message-generator';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { AssessmentReportModelBuilder } from './assessment-report-model-builder';

export class AssessmentReportModelBuilderFactory {
    public create(
        assessmentsProvider: IAssessmentsProvider,
        assessmentStoreData: IAssessmentStoreData,
        tabStoreData: ITabStoreData,
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
