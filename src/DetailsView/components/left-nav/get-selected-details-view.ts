// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { IVisualizationStoreData } from '../../../common/types/store-data/ivisualization-store-data';

export type GetSelectedDetailsViewProps = GetFastPassSelectedDetailsViewProps & GetAssessmentSelectedDetailsViewProps;

export type GetAssessmentSelectedDetailsViewProps = {
    assessmentStoreData: IAssessmentStoreData;
};

export type GetFastPassSelectedDetailsViewProps = {
    visualizationStoreData: IVisualizationStoreData;
};

export const getAssessmentSelectedDetailsView = (props: GetAssessmentSelectedDetailsViewProps) =>
    props.assessmentStoreData.assessmentNavState.selectedTestType;

export const getFastPassSelectedDetailsView = (props: GetFastPassSelectedDetailsViewProps) =>
    props.visualizationStoreData.selectedFastPassDetailsView;
