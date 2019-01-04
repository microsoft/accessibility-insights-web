// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { IAssessmentStoreData } from './../../common/types/store-data/iassessment-result-data.d';
import { IVisualizationStoreData } from './../../common/types/store-data/ivisualization-store-data.d';
import { PivotConfiguration } from '../../common/configs/pivot-configuration';
import { IDetailsViewContainerState } from '../details-view-container';

export class SelectedDetailsViewProvider {
    private pivotConfiguration: PivotConfiguration;

    constructor(pivotConfiguration: PivotConfiguration) {
        this.pivotConfiguration = pivotConfiguration;
    }

    public getSelectedDetailsView(data: Partial<IDetailsViewContainerState>): VisualizationType {
        if (data == null || data.visualizationStoreData == null || data.assessmentStoreData == null) {
            return null;
        }

        return this.pivotConfiguration
            .getConfigByType(data.visualizationStoreData.selectedDetailsViewPivot)
            .getSelectedDetailsView(data);
    }
}
