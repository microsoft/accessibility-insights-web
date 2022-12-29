// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
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

export type SummaryModelGettersTypeMap = {
    getAssessmentSummaryModelFromProviderAndStoreData: GetSelectedAssessmentSummaryModelFromProviderAndStoreData;
    getAssessmentSummaryModelFromProviderAndStatusData: GetSelectedAssessmentSummaryModelFromProviderAndStatusData;
};

export type AssessmentSummaryModelGetters = {
    [key in
        | DetailsViewPivotType.assessment
        | DetailsViewPivotType.mediumPass]: SummaryModelGettersTypeMap;
};

export type GetSelectedAssessmentSummaryModelGettersProps = {
    getAssessmentSummaryModelFromProviderAndStoreData: GetSelectedAssessmentSummaryModelFromProviderAndStoreData;
    getQuickAssessSummaryModelFromProviderAndStoreData: GetSelectedAssessmentSummaryModelFromProviderAndStoreData;
    getAssessmentSummaryModelFromProviderAndStatusData: GetSelectedAssessmentSummaryModelFromProviderAndStatusData;
    getQuickAssessSummaryModelFromProviderAndStatusData: GetSelectedAssessmentSummaryModelFromProviderAndStatusData;
};

export type SelectedAssessmentSummaryModelGetter =
    | GetSelectedAssessmentSummaryModelFromProviderAndStoreData
    | GetSelectedAssessmentSummaryModelFromProviderAndStatusData;

export type GetSelectedAssessmentSummaryModelGetters = (
    props: GetSelectedAssessmentSummaryModelGettersProps,
) => SummaryModelGettersTypeMap;

export const getSelectedSummaryModelGettersForAssessment: GetSelectedAssessmentSummaryModelGetters =
    (props: GetSelectedAssessmentSummaryModelGettersProps) => {
        return getSelectedSummaryModelGetters(props)[DetailsViewPivotType.assessment];
    };

export const getSelectedSummaryModelGettersForQuickAssess = (
    props: GetSelectedAssessmentSummaryModelGettersProps,
) => {
    return getSelectedSummaryModelGetters(props)[DetailsViewPivotType.mediumPass];
};

const getSelectedSummaryModelGetters = (props: GetSelectedAssessmentSummaryModelGettersProps) => {
    return {
        [DetailsViewPivotType.assessment]: {
            getAssessmentSummaryModelFromProviderAndStoreData:
                props.getAssessmentSummaryModelFromProviderAndStoreData,
            getAssessmentSummaryModelFromProviderAndStatusData:
                props.getAssessmentSummaryModelFromProviderAndStatusData,
        },
        [DetailsViewPivotType.mediumPass]: {
            getAssessmentSummaryModelFromProviderAndStoreData:
                props.getQuickAssessSummaryModelFromProviderAndStoreData,
            getAssessmentSummaryModelFromProviderAndStatusData:
                props.getQuickAssessSummaryModelFromProviderAndStatusData,
        },
    };
};
