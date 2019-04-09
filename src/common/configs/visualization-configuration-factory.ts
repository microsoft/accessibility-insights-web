// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { ColorAdHocVisualization } from '../../ad-hoc-visualizations/color/visualization';
import { HeadingsAdHocVisualization } from '../../ad-hoc-visualizations/headings/visualization';
import { IssuesAdHocVisualization } from '../../ad-hoc-visualizations/issues/visualization';
import { LandmarksAdHocVisualization } from '../../ad-hoc-visualizations/landmarks/visualization';
import { TabStopsAdHocVisualization } from '../../ad-hoc-visualizations/tab-stops/visualization';
import { Assessments } from '../../assessments/assessments';
import { ToggleActionPayload } from '../../background/actions/action-payloads';
import { UniquelyIdentifiableInstances } from '../../background/instance-identifier-generator';
import { TestViewProps } from '../../DetailsView/components/test-view';
import { Analyzer } from '../../injected/analyzers/analyzer';
import { AnalyzerProvider } from '../../injected/analyzers/analyzer-provider';
import { HtmlElementAxeResults, ScannerUtils } from '../../injected/scanner-utils';
import { PropertyBags, VisualizationInstanceProcessorCallback } from '../../injected/visualization-instance-processor';
import { Drawer } from '../../injected/visualization/drawer';
import { DrawerProvider } from '../../injected/visualization/drawer-provider';
import { ScanResults } from '../../scanner/iruleresults';
import { DictionaryNumberTo, DictionaryStringTo } from '../../types/common-types';
import { ContentPageComponent } from '../../views/content/content-page';
import { EnumHelper } from '../enum-helper';
import { IAnalyzerTelemetryCallback } from '../types/analyzer-telemetry-callbacks';
import { AssessmentStoreData, IAssessmentData } from '../types/store-data/assessment-result-data';
import { ScanData, TestsEnabledState } from '../types/store-data/visualization-store-data';
import { TelemetryProcessor } from '../types/telemetry-processor';
import { VisualizationType } from '../types/visualization-type';
import { TestMode } from './test-mode';

export interface DisplayableVisualizationTypeData {
    title: string;
    enableMessage: string;
    toggleLabel: string;
    linkToDetailsViewText: string;
}

export interface AssesssmentVisualizationConfiguration {
    key: string;
    getTestView: (props: TestViewProps) => JSX.Element;
    getStoreData: (data: TestsEnabledState) => ScanData;
    enableTest: (data: ScanData, payload: ToggleActionPayload) => void;
    disableTest: (data: ScanData, step?: string) => void;
    getTestStatus: (data: ScanData, step?: string) => boolean;
    getAssessmentData?: (data: AssessmentStoreData) => IAssessmentData;
    setAssessmentData?: (data: AssessmentStoreData, selectorMap: DictionaryStringTo<any>, instanceMap?: DictionaryStringTo<any>) => void;
    analyzerMessageType: string;
    analyzerProgressMessageType?: string;
    resultProcessor?: (scanner: ScannerUtils) => (results: ScanResults) => DictionaryStringTo<HtmlElementAxeResults>;
    telemetryProcessor?: TelemetryProcessor<IAnalyzerTelemetryCallback>;
    getAnalyzer: (analyzerProvider: AnalyzerProvider, testStep?: string) => Analyzer;
    getIdentifier: (testStep?: string) => string;
    visualizationInstanceProcessor: (testStep?: string) => VisualizationInstanceProcessorCallback<PropertyBags, PropertyBags>;
    getNotificationMessage: (selectorMap: DictionaryStringTo<any>, testStep?: string) => string;
    getDrawer: (provider: DrawerProvider, testStep?: string) => Drawer;
    getSwitchToTargetTabOnScan: (testStep?: string) => boolean;
    getInstanceIdentiferGenerator: (testStep?: string) => (instance: UniquelyIdentifiableInstances) => string;
    getUpdateVisibility: (testStep?: string) => boolean;
}

export interface VisualizationConfiguration extends AssesssmentVisualizationConfiguration {
    key: string;
    testMode: TestMode;
    featureFlagToEnable?: string;
    getTestView: (props: TestViewProps) => JSX.Element;
    getStoreData: (data: TestsEnabledState) => ScanData;
    getAssessmentData?: (data: AssessmentStoreData) => IAssessmentData;
    setAssessmentData?: (data: AssessmentStoreData, selectorMap: DictionaryStringTo<any>, instanceMap?: DictionaryStringTo<any>) => void;
    displayableData: DisplayableVisualizationTypeData;
    chromeCommand: string;
    launchPanelDisplayOrder: number;
    adhocToolsPanelDisplayOrder: number;
    analyzerMessageType: string;
    analyzerProgressMessageType?: string;
    analyzerTerminatedMessageType?: string;
    guidance?: ContentPageComponent;
}

export class VisualizationConfigurationFactory {
    private configurationByType: DictionaryNumberTo<VisualizationConfiguration>;

    constructor() {
        this.configurationByType = {
            [VisualizationType.Color]: ColorAdHocVisualization,
            [VisualizationType.Headings]: HeadingsAdHocVisualization,
            [VisualizationType.Issues]: IssuesAdHocVisualization,
            [VisualizationType.Landmarks]: LandmarksAdHocVisualization,
            [VisualizationType.TabStops]: TabStopsAdHocVisualization,
        };
    }

    public getConfigurationByKey(key: string): VisualizationConfiguration {
        return _.find(_.values(this.configurationByType), config => config.key === key);
    }

    public getConfiguration(visualizationType: VisualizationType): VisualizationConfiguration {
        if (Assessments.isValidType(visualizationType)) {
            const assessment = Assessments.forType(visualizationType);
            const defaults = {
                testMode: TestMode.Assessments,
                chromeCommand: null,
                launchPanelDisplayOrder: null,
                adhocToolsPanelDisplayOrder: null,
                displayableData: {
                    title: assessment.title,
                    noResultsFound: null,
                    enableMessage: null,
                    toggleLabel: null,
                    linkToDetailsViewText: null,
                },
            };
            const config = assessment.getVisualizationConfiguration();
            return { ...config, ...defaults };
        }

        const configuration = this.configurationByType[visualizationType];

        if (configuration == null) {
            throw new Error(`Unsupported type: ${visualizationType}`);
        }

        return configuration;
    }

    public getChromeCommandToVisualizationTypeMap(): DictionaryStringTo<VisualizationType> {
        const map: DictionaryStringTo<VisualizationType> = {};

        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);

        _.each(types, visualizationType => {
            const configuration = this.configurationByType[visualizationType];

            if (configuration && configuration.chromeCommand != null) {
                map[configuration.chromeCommand] = visualizationType;
            }
        });

        return map;
    }
}
