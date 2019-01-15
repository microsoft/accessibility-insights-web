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

export type ILandmarksData = IScanData;
export type IHeadingsData = IScanData;
export type IHeadingsAssessmentData = IScanData;
export type ITabStopsData = IScanData;
export type IColorData = IScanData;
export type IColorSensoryAssessmentData = IScanData;

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
        [key: string]: IAssessmentScanData,
    };
    adhoc: {
        [key: string]: IScanData,
    };
}
