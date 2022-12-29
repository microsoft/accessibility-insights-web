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

export function getQuickAssessSummaryModelFromProviderAndStoreData(
    assessmentsProvider: AssessmentsProvider,
    quickAssessStoreData: AssessmentStoreData,
    requirementKeys: string[],
): Model.OverviewSummaryReportModel {
    const automatedChecksAssessment = assessmentsProvider.forKey(AutomatedChecks.key);
    const automatedChecksResult = {
        title: automatedChecksAssessment.title,
        storeData: {
            testStepStatus:
                quickAssessStoreData.assessments[automatedChecksAssessment.key].testStepStatus,
        },
    };
    const quickAssessResults = requirementKeys.map(requirementKey => {
        const assessment = assessmentsProvider.forRequirementKey(requirementKey);
        const requirement = assessmentsProvider.getStep(
            assessment.visualizationType,
            requirementKey,
        );
        return {
            title: requirement.name,
            storeData: {
                testStepStatus: {
                    [requirementKey]:
                        quickAssessStoreData.assessments[assessment.key].testStepStatus[
                            requirementKey
                        ],
                },
            },
        };
    });
    quickAssessResults.unshift(automatedChecksResult);

    return getAssessmentSummaryModelFromResults(quickAssessResults);
}

export function getQuickAssessSummaryModelFromProviderAndStatusData(
    quickAssessProvider: AssessmentsProvider,
    statusData: AssessmentStatusData,
    requirementKeys: string[],
): Model.OverviewSummaryReportModel {
    const automatedChecksAssessment = quickAssessProvider.forKey(AutomatedChecks.key);
    const automatedChecksResult = {
        title: automatedChecksAssessment.title,
        storeData: {
            testStepStatus: statusData[automatedChecksAssessment.key],
        },
    };
    const quickAssessResults = requirementKeys.map(requirementKey => {
        const assessment = quickAssessProvider.forRequirementKey(requirementKey);
        const requirement = quickAssessProvider.getStep(
            assessment.visualizationType,
            requirementKey,
        );
        return {
            title: requirement.name,
            storeData: {
                testStepStatus: {
                    [requirementKey]: statusData[assessment.key][requirementKey],
                },
            },
        };
    });
    quickAssessResults.unshift(automatedChecksResult);

    return getAssessmentSummaryModelFromResults(quickAssessResults);
}
