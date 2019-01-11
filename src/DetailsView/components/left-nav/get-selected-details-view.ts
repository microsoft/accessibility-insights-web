// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { IVisualizationStoreData } from '../../../common/types/store-data/ivisualization-store-data';

export type GetSelectedDetailsViewProps = {
    assessmentStoreData: IAssessmentStoreData,
    visualizationStoreData: IVisualizationStoreData,
};

export const getAssessmentSelectedDetailsView = (props: GetSelectedDetailsViewProps) => {
    return props.assessmentStoreData.assessmentNavState.selectedTestType;
};

export const getFastPassSelectedDetailsView = (props: GetSelectedDetailsViewProps) => {
    return props.visualizationStoreData.selectedFastPassDetailsView;
};
