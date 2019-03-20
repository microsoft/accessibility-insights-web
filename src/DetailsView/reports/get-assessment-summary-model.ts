// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { chain, zipObject } from 'lodash/index';

import { Assessment } from '../../assessments/types/iassessment';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { ManualTestStatusData } from '../../common/types/manual-test-status';
import { IAssessmentData, IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import * as Model from './assessment-report-model';
import { OutcomeMath } from './components/outcome-math';
import { allOutcomeTypes, OutcomeStats, OutcomeType, outcomeTypeFromTestStatus } from './components/outcome-type';

export type AssessmentSummaryResult = Pick<Assessment, 'title'> & { storeData: Pick<IAssessmentData, 'testStepStatus'> };
export type AssessmentStatusData = { [key: string]: ManualTestStatusData };

export type GetAssessmentSummaryModelFromProviderAndStoreData = (
    assessmentsProvider: IAssessmentsProvider,
    assessmentStoreData: IAssessmentStoreData,
) => Model.IOverviewSummaryReportModel;

export type GetAssessmentSummaryModelFromProviderAndStatusData = (
    assessmentsProvider: IAssessmentsProvider,
    statusData: AssessmentStatusData,
) => Model.IOverviewSummaryReportModel;

export function getAssessmentSummaryModelFromProviderAndStoreData(
    assessmentsProvider: IAssessmentsProvider,
    assessmentStoreData: IAssessmentStoreData,
): Model.IOverviewSummaryReportModel {
    const assessments = assessmentsProvider.all();
    const assessmentResults: AssessmentSummaryResult[] = assessments.map(a => ({
        title: a.title,
        storeData: {
            testStepStatus: assessmentStoreData.assessments[a.key].testStepStatus,
        },
    }));

    return getAssessmentSummaryModelFromResults(assessmentResults);
}

export function getAssessmentSummaryModelFromProviderAndStatusData(
    assessmentsProvider: IAssessmentsProvider,
    statusData: AssessmentStatusData,
): Model.IOverviewSummaryReportModel {
    const assessments = assessmentsProvider.all();
    const assessmentResults: AssessmentSummaryResult[] = assessments.map(a => ({
        title: a.title,
        storeData: {
            testStepStatus: statusData[a.key],
        },
    }));

    return getAssessmentSummaryModelFromResults(assessmentResults);
}

export function getAssessmentSummaryModelFromResults(assessmentResults: AssessmentSummaryResult[]): Model.IOverviewSummaryReportModel {
    const reportSummaryDetailsData = assessmentResults.map(assessmentResult => ({
        displayName: assessmentResult.title,
        ...getCounts(assessmentResult),
    }));

    const byPercentage = OutcomeMath.weightedPercentage(reportSummaryDetailsData);
    const byRequirement = OutcomeMath.sum(reportSummaryDetailsData);

    return {
        byRequirement,
        byPercentage,
        reportSummaryDetailsData,
    };

    function getCounts(assessment: AssessmentSummaryResult): OutcomeStats {
        const zeros = zipObject(allOutcomeTypes, [0, 0, 0]) as OutcomeStats;

        const counts = chain(assessment.storeData.testStepStatus)
            .values()
            .countBy(step => outcomeTypeFromTestStatus(step.stepFinalResult))
            .value() as { [P in OutcomeType]: number };
        return { ...zeros, ...counts };
    }
}
