// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DictionaryStringTo } from '../../../types/common-types';
import { VisualizationType } from '../visualization-type';

export interface ScanData {
    enabled: boolean;
}

export interface AssessmentScanData extends ScanData {
    stepStatus: DictionaryStringTo<boolean>;
}

export interface VisualizationStoreData {
    tests: TestsEnabledState;
    scanning: string;
    selectedFastPassDetailsView: VisualizationType;
    selectedAdhocDetailsView: VisualizationType;
    selectedDetailsViewPivot: DetailsViewPivotType;
    injectingRequested: boolean;
    injectingStarted: boolean;
    focusedTarget: string[];
}

export interface TestsEnabledState {
    assessments: {
        [key: string]: AssessmentScanData;
    };
    adhoc: {
        [key: string]: ScanData;
    };
}
