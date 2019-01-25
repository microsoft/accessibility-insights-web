// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from '../details-view-pivot-type';
import { VisualizationType } from '../visualization-type';

export interface IScanData {
    enabled: boolean;
}

export interface IAssessmentScanData extends IScanData {
    stepStatus: IDictionaryStringTo<boolean>;
}

export interface IVisualizationStoreData {
    tests: ITestsEnabledState;
    scanning: string;
    selectedFastPassDetailsView: VisualizationType;
    selectedAdhocDetailsView: VisualizationType;
    selectedDetailsViewPivot: DetailsViewPivotType;
    injectingInProgress: boolean;
    injectingStarted: boolean;
    focusedTarget: string[];
}

export interface ITestsEnabledState {
    assessments: {
        [key: string]: IAssessmentScanData;
    };
    adhoc: {
        [key: string]: IScanData;
    };
}
