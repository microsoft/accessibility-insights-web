// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from '../details-view-pivot-type';
import { VisualizationType } from '../visualization-type';

// tslint:disable-next-line:interface-name
export interface IScanData {
    enabled: boolean;
}

// tslint:disable-next-line:interface-name
export interface IAssessmentScanData extends IScanData {
    stepStatus: IDictionaryStringTo<boolean>;
}

// tslint:disable-next-line:interface-name
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

// tslint:disable-next-line:interface-name
export interface ITestsEnabledState {
    assessments: {
        [key: string]: IAssessmentScanData;
    };
    adhoc: {
        [key: string]: IScanData;
    };
}
