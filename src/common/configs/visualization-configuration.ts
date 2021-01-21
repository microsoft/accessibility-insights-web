// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { ContentPageComponent } from 'views/content/content-page';
import { DictionaryStringTo } from '../../types/common-types';
import { DisplayableVisualizationTypeData } from '../types/displayable-visualization-type-data';
import { AssessmentData, AssessmentStoreData } from '../types/store-data/assessment-result-data';
import { ScanData, TestsEnabledState } from '../types/store-data/visualization-store-data';
import { AssessmentVisualizationConfiguration } from './assessment-visualization-configuration';
import { TestMode } from './test-mode';

export interface VisualizationConfiguration extends AssessmentVisualizationConfiguration {
    key: string;
    testMode: TestMode;
    featureFlagToEnable?: string;
    getStoreData: (data: TestsEnabledState) => ScanData;
    getAssessmentData?: (data: AssessmentStoreData) => AssessmentData;
    setAssessmentData?: (
        data: AssessmentStoreData,
        selectorMap: DictionaryStringTo<any>,
        instanceMap?: DictionaryStringTo<any>,
    ) => void;
    displayableData: DisplayableVisualizationTypeData;
    chromeCommand?: string;
    launchPanelDisplayOrder: number;
    adhocToolsPanelDisplayOrder: number;
    analyzerProgressMessageType?: string;
    analyzerTerminatedMessageType?: string;
    guidance?: ContentPageComponent;
    shouldShowExportReport: (unifiedScanResultStoreData: UnifiedScanResultStoreData) => boolean;
}
