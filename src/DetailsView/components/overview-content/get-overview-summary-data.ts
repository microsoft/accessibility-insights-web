// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsFeatureFlagFilter } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsRequirementsFilter } from 'assessments/assessments-requirements-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from 'reports/get-assessment-summary-model';
import { GetQuickAssessSummaryModelFromProviderAndStoreData } from 'reports/get-quick-assess-summary-model';

export type GetOverviewSummaryDataDeps = {
    assessmentsProvider: AssessmentsProvider;
    assessmentsProviderWithFeaturesEnabled: AssessmentsFeatureFlagFilter;
    assessmentsProviderForRequirements: AssessmentsRequirementsFilter;
    getAssessmentSummaryModelFromProviderAndStoreData: GetAssessmentSummaryModelFromProviderAndStoreData;
    getQuickAssessSummaryModelFromProviderAndStoreData: GetQuickAssessSummaryModelFromProviderAndStoreData;
    quickAssessRequirementKeys: string[];
};

export type GetOverviewSummaryDataProps = {
    deps: GetOverviewSummaryDataDeps;
    assessmentStoreData: AssessmentStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
};

export type GetOverviewSummaryData = (
    props: GetOverviewSummaryDataProps,
) => OverviewSummaryReportModel;

export const getOverviewSummaryDataForPivot: (
    selectedPivotType: DetailsViewPivotType,
) => GetOverviewSummaryData =
    (selectedPivotType: DetailsViewPivotType) => (props: GetOverviewSummaryDataProps) => {
        const filteredFeatureFlagProvider = props.deps.assessmentsProviderWithFeaturesEnabled(
            props.deps.assessmentsProvider,
            props.featureFlagStoreData,
        );
        if (selectedPivotType === DetailsViewPivotType.assessment) {
            return props.deps.getAssessmentSummaryModelFromProviderAndStoreData(
                filteredFeatureFlagProvider,
                props.assessmentStoreData,
            );
        } else {
            const filteredRequirementsProvider = props.deps.assessmentsProviderForRequirements(
                filteredFeatureFlagProvider,
                props.deps.quickAssessRequirementKeys,
            );
            return props.deps.getQuickAssessSummaryModelFromProviderAndStoreData(
                filteredRequirementsProvider,
                props.assessmentStoreData,
                props.deps.quickAssessRequirementKeys,
            );
        }
    };
