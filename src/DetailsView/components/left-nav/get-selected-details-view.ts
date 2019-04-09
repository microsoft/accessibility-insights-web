// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from '../../../common/types/store-data/visualization-store-data';

export type GetSelectedDetailsViewProps = GetFastPassSelectedDetailsViewProps & GetAssessmentSelectedDetailsViewProps;

export type GetAssessmentSelectedDetailsViewProps = {
    assessmentStoreData: IAssessmentStoreData;
};

export type GetFastPassSelectedDetailsViewProps = {
    visualizationStoreData: VisualizationStoreData;
};

export const getAssessmentSelectedDetailsView = (props: GetAssessmentSelectedDetailsViewProps) =>
    props.assessmentStoreData.assessmentNavState.selectedTestType;

export const getFastPassSelectedDetailsView = (props: GetFastPassSelectedDetailsViewProps) =>
    props.visualizationStoreData.selectedFastPassDetailsView;
