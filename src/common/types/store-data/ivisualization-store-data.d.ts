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
    stepStatus: DictionaryStringTo<boolean>;
}

// tslint:disable-next-line:interface-name
export interface IVisualizationStoreData {
    tests: TestsEnabledState;
    scanning: string;
    selectedFastPassDetailsView: VisualizationType;
    selectedAdhocDetailsView: VisualizationType;
    selectedDetailsViewPivot: DetailsViewPivotType;
    injectingInProgress: boolean;
    injectingStarted: boolean;
    focusedTarget: string[];
}

export interface TestsEnabledState {
    assessments: {
        [key: string]: IAssessmentScanData;
    };
    adhoc: {
        [key: string]: IScanData;
    };
}
