// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import {
    AssessmentData,
    AssessmentStoreData,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatusData } from 'common/types/store-data/manual-test-status';
import { chain, zipObject } from 'lodash';

import * as Model from './assessment-report-model';
import { OutcomeMath } from './components/outcome-math';
import {
    allRequirementOutcomeTypes,
    outcomeTypeFromTestStatus,
    RequirementOutcomeStats,
    RequirementOutcomeType,
} from './components/requirement-outcome-type';

export type AssessmentSummaryResult = Pick<Assessment, 'title'> & {
    storeData: Pick<AssessmentData, 'testStepStatus'>;
};
export type AssessmentStatusData = { [key: string]: ManualTestStatusData };

export type GetAssessmentSummaryModelFromProviderAndStoreData = (
    assessmentsProvider: AssessmentsProvider,
    assessmentStoreData: AssessmentStoreData,
) => Model.OverviewSummaryReportModel;

export type GetAssessmentSummaryModelFromProviderAndStatusData = (
    assessmentsProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
) => Model.OverviewSummaryReportModel;

export function getAssessmentSummaryModelFromProviderAndStoreData(
    assessmentsProvider: AssessmentsProvider,
    assessmentStoreData: AssessmentStoreData,
): Model.OverviewSummaryReportModel {
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
    assessmentsProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
): Model.OverviewSummaryReportModel {
    const assessments = assessmentsProvider.all();
    const assessmentResults: AssessmentSummaryResult[] = assessments.map(a => ({
        title: a.title,
        storeData: {
            testStepStatus: statusData[a.key],
        },
    }));

    return getAssessmentSummaryModelFromResults(assessmentResults);
}

export function getAssessmentSummaryModelFromResults(
    assessmentResults: AssessmentSummaryResult[],
): Model.OverviewSummaryReportModel {
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

    function getCounts(assessment: AssessmentSummaryResult): RequirementOutcomeStats {
        const zeros = zipObject(allRequirementOutcomeTypes, [0, 0, 0]) as RequirementOutcomeStats;

        const counts = chain(assessment.storeData.testStepStatus)
            .values()
            .countBy(step => outcomeTypeFromTestStatus(step.stepFinalResult))
            .value() as { [P in RequirementOutcomeType]: number };
        return { ...zeros, ...counts };
    }
}
