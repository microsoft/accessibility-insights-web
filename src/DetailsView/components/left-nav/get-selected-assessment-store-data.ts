// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';

export type GetSelectedAssessmentStoreDataProps = {
    assessmentStoreData: AssessmentStoreData;
    quickAssessStoreData: AssessmentStoreData;
};

export type GetSelectedAssessmentStoreData = (
    props: GetSelectedAssessmentStoreDataProps,
) => AssessmentStoreData;

export const getAssessmentStoreData = (props: GetSelectedAssessmentStoreDataProps) => {
    return props.assessmentStoreData;
};

export const getQuickAssessStoreData = (props: GetSelectedAssessmentStoreDataProps) => {
    return props.quickAssessStoreData;
};
