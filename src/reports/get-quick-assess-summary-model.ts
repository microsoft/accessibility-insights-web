// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import {
    AssessmentStatusData,
    getAssessmentSummaryModelFromResults,
} from 'reports/get-assessment-summary-model';
import * as Model from './assessment-report-model';

export type GetQuickAssessSummaryModelFromProviderAndStoreData = (
    assessmentsProvider: AssessmentsProvider,
    assessmentStoreData: AssessmentStoreData,
    requirementKeys: string[],
) => Model.OverviewSummaryReportModel;

export type GetQuickAssessSummaryModelFromProviderAndStatusData = (
    assessmentsProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
    requirementKeys: string[],
) => Model.OverviewSummaryReportModel;

function getStoreDataByAssessmentKey(
    assessmentsProvider: AssessmentsProvider,
    quickAssessStoreData: AssessmentStoreData,
    assessmentKey: string,
) {
    const assessment = assessmentsProvider.forKey(assessmentKey)!;
    const assessmentData = quickAssessStoreData.assessments[assessmentKey]!;
    return {
        title: assessment.title,
        storeData: {
            testStepStatus: assessmentData.testStepStatus,
        },
    };
}

function getStoreDataByRequirementKey(
    assessmentsProvider: AssessmentsProvider,
    quickAssessStoreData: AssessmentStoreData,
    requirementKey: string,
) {
    const assessment = assessmentsProvider.forRequirementKey(requirementKey)!;
    const requirement = assessmentsProvider.getStep(assessment.visualizationType, requirementKey)!;
    const requirementData = quickAssessStoreData.assessments[assessment.key]!;
    return {
        title: requirement.name,
        storeData: {
            testStepStatus: {
                [requirementKey]: requirementData.testStepStatus[requirementKey],
            },
        },
    };
}

function getStatusDataByAssessmentKey(
    assessmentsProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
    assessmentKey: string,
) {
    const assessment = assessmentsProvider.forKey(assessmentKey)!;
    return {
        title: assessment.title,
        storeData: {
            testStepStatus: statusData[assessmentKey]!,
        },
    };
}

function getStatusDataByRequirementKey(
    assessmentsProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
    requirementKey: string,
) {
    const assessment = assessmentsProvider.forRequirementKey(requirementKey)!;
    const requirement = assessmentsProvider.getStep(assessment.visualizationType, requirementKey)!;
    return {
        title: requirement.name,
        storeData: {
            testStepStatus: {
                [requirementKey]: statusData[assessment.key][requirementKey],
            },
        },
    };
}
export function getQuickAssessSummaryModelFromProviderAndStoreData(
    assessmentsProvider: AssessmentsProvider,
    quickAssessStoreData: AssessmentStoreData,
    requirementKeys: string[],
): Model.OverviewSummaryReportModel {
    const automatedChecksResult = getStoreDataByAssessmentKey(
        assessmentsProvider,
        quickAssessStoreData,
        AutomatedChecks.key,
    );
    const quickAssessResults = requirementKeys.map(requirementKey =>
        getStoreDataByRequirementKey(assessmentsProvider, quickAssessStoreData, requirementKey),
    );

    quickAssessResults.unshift(automatedChecksResult);

    return getAssessmentSummaryModelFromResults(quickAssessResults);
}

export function getQuickAssessSummaryModelFromProviderAndStatusData(
    quickAssessProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
    requirementKeys: string[],
): Model.OverviewSummaryReportModel {
    const automatedChecksResult = getStatusDataByAssessmentKey(
        quickAssessProvider,
        statusData,
        AutomatedChecks.key,
    );

    const quickAssessResults = requirementKeys.map(requirementKey =>
        getStatusDataByRequirementKey(quickAssessProvider, statusData, requirementKey),
    );

    quickAssessResults.unshift(automatedChecksResult);

    return getAssessmentSummaryModelFromResults(quickAssessResults);
}
