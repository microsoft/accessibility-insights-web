// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';

export type GetSelectedAssessmentCardSelectionStoreDataProps = {
    assessmentCardSelectionStoreData: AssessmentCardSelectionStoreData;
    quickAssessCardSelectionStoreData: AssessmentCardSelectionStoreData;
};

export type GetSelectedAssessmentCardSelectionStoreData = (
    props: GetSelectedAssessmentCardSelectionStoreDataProps,
) => AssessmentCardSelectionStoreData;

export const getAssessmentCardSelectionStoreData = (
    props: GetSelectedAssessmentCardSelectionStoreDataProps,
) => {
    return props.assessmentCardSelectionStoreData;
};

export const getQuickAssessCardSelectionStoreData = (
    props: GetSelectedAssessmentCardSelectionStoreDataProps,
) => {
    return props.quickAssessCardSelectionStoreData;
};
