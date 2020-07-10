// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentPageComponent } from 'views/content/content-page';
import { CommonTestViewProps } from '../../DetailsView/components/test-view';
import { DictionaryStringTo } from '../../types/common-types';
import { AssessmentData, AssessmentStoreData } from '../types/store-data/assessment-result-data';
import { ScanData, TestsEnabledState } from '../types/store-data/visualization-store-data';
import { AssessmentVisualizationConfiguration } from './assessment-visualization-configuration';
import { TestMode } from './test-mode';
import { DisplayableVisualizationTypeData } from './visualization-configuration-factory';

export interface VisualizationConfiguration extends AssessmentVisualizationConfiguration {
    key: string;
    testMode: TestMode;
    featureFlagToEnable?: string;
    getTestView: (props: CommonTestViewProps) => JSX.Element;
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
}
