// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../../../types/common-types';
import { VisualizationType } from '../visualization-type';
import { DetailsViewPivotType } from './details-view-pivot-type';

export interface ScanData {
    enabled: boolean;
}

export interface AssessmentScanData extends ScanData {
    stepStatus: DictionaryStringTo<boolean>;
}

export type TestsScanData = DictionaryStringTo<AssessmentScanData | ScanData>;

export interface VisualizationStoreData {
    tests: TestsEnabledState;
    scanning: string;
    selectedFastPassDetailsView: VisualizationType;
    selectedAdhocDetailsView: VisualizationType;
    selectedDetailsViewPivot: DetailsViewPivotType;
    injectingState: InjectingState;
    injectionAttempts?: number;
    focusedTarget: string[];
}

export interface TestsEnabledState {
    assessments: {
        [key: string]: AssessmentScanData;
    };
    adhoc: {
        [key: string]: ScanData;
    };
    mediumPass: {
        [key: string]: AssessmentScanData;
    };
}

export const enum InjectingState {
    notInjecting = 'notInjecting',
    injectingRequested = 'injectingRequested',
    injectingStarted = 'injectingStarted',
    injectingFailed = 'injectingFailed',
}
