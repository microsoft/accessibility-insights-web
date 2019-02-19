// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { ColorAdHocVisualization } from '../../ad-hoc-visualizations/color/visualization';
import { HeadingsAdHocVisualization } from '../../ad-hoc-visualizations/headings/visualization';
import { IssuesAdHocVisualization } from '../../ad-hoc-visualizations/issues/visualization';
import { LandmarksAdHocVisualization } from '../../ad-hoc-visualizations/landmarks/visualization';
import { TabStopsAdHocVisualization } from '../../ad-hoc-visualizations/tab-stops/visualization';
import { Assessments } from '../../assessments/assessments';
import { IUniquelyIdentifiableInstances } from '../../background/instance-identifier-generator';
import { TestViewProps } from '../../DetailsView/components/test-view';
import { IAnalyzer } from '../../injected/analyzers/ianalyzer';
import { IHtmlElementAxeResults, ScannerUtils } from '../../injected/scanner-utils';
import { IPropertyBags, IVisualizationInstanceProcessorCallback } from '../../injected/visualization-instance-processor';
import { DrawerProvider } from '../../injected/visualization/drawer-provider';
import { IDrawer } from '../../injected/visualization/idrawer';
import { ScanResults } from '../../scanner/iruleresults';
import { EnumHelper } from '../enum-helper';
import { IAnalyzerTelemetryCallback } from '../types/analyzer-telemetry-callbacks';
import { IAssessmentData, IAssessmentStoreData } from '../types/store-data/iassessment-result-data';
import { IScanData, ITestsEnabledState } from '../types/store-data/ivisualization-store-data';
import { TelemetryProcessor } from '../types/telemetry-processor';
import { VisualizationType } from '../types/visualization-type';
import { ToggleActionPayload } from '../../background/actions/action-payloads';
import { AnalyzerProvider } from '../../injected/analyzers/analyzer-provider';
import { ContentPageComponent } from '../../views/content/content-page';
import { TestMode } from './test-mode';

export interface IDisplayableVisualizationTypeData {
    title: string;
    enableMessage: string;
    toggleLabel: string;
    linkToDetailsViewText: string;
}

export interface IAssesssmentVisualizationConfiguration {
    key: string;
    getTestView: (props: TestViewProps) => JSX.Element;
    getStoreData: (data: ITestsEnabledState) => IScanData;
    enableTest: (data: IScanData, payload: ToggleActionPayload) => void;
    disableTest: (data: IScanData, step?: string) => void;
    getTestStatus: (data: IScanData, step?: string) => boolean;
    getAssessmentData?: (data: IAssessmentStoreData) => IAssessmentData;
    setAssessmentData?: (data: IAssessmentStoreData, selectorMap: IDictionaryStringTo<any>, instanceMap?: IDictionaryStringTo<any>) => void;
    analyzerMessageType: string;
    analyzerProgressMessageType?: string;
    resultProcessor?: (scanner: ScannerUtils) => (results: ScanResults) => IDictionaryStringTo<IHtmlElementAxeResults>;
    telemetryProcessor?: TelemetryProcessor<IAnalyzerTelemetryCallback>;
    getAnalyzer: (analyzerProvider: AnalyzerProvider, testStep?: string) => IAnalyzer<any>;
    getIdentifier: (testStep?: string) => string;
    visualizationInstanceProcessor: (testStep?: string) => IVisualizationInstanceProcessorCallback<IPropertyBags, IPropertyBags>;
    getNotificationMessage: (selectorMap: IDictionaryStringTo<any>, testStep?: string) => string;
    getDrawer: (provider: DrawerProvider, testStep?: string) => IDrawer;
    getSwitchToTargetTabOnScan: (testStep?: string) => boolean;
    getInstanceIdentiferGenerator: (testStep?: string) => (instance: IUniquelyIdentifiableInstances) => string;
    getUpdateVisibility: (testStep?: string) => boolean;
}

export interface IVisualizationConfiguration extends IAssesssmentVisualizationConfiguration {
    key: string;
    testMode: TestMode;
    featureFlagToEnable?: string;
    getTestView: (props: TestViewProps) => JSX.Element;
    getStoreData: (data: ITestsEnabledState) => IScanData;
    getAssessmentData?: (data: IAssessmentStoreData) => IAssessmentData;
    setAssessmentData?: (data: IAssessmentStoreData, selectorMap: IDictionaryStringTo<any>, instanceMap?: IDictionaryStringTo<any>) => void;
    displayableData: IDisplayableVisualizationTypeData;
    detailsViewStaticContent: JSX.Element;
    chromeCommand: string;
    launchPanelDisplayOrder: number;
    adhocToolsPanelDisplayOrder: number;
    analyzerMessageType: string;
    analyzerProgressMessageType?: string;
    analyzerTerminatedMessageType?: string;
    guidance?: ContentPageComponent;
}

export class VisualizationConfigurationFactory {
    private configurationByType: IDictionaryNumberTo<IVisualizationConfiguration>;

    constructor() {
        this.configurationByType = {
            [VisualizationType.Color]: ColorAdHocVisualization,
            [VisualizationType.Headings]: HeadingsAdHocVisualization,
            [VisualizationType.Issues]: IssuesAdHocVisualization,
            [VisualizationType.Landmarks]: LandmarksAdHocVisualization,
            [VisualizationType.TabStops]: TabStopsAdHocVisualization,
        };
    }

    public getConfigurationByKey(key: string) {
        return _.find(_.values(this.configurationByType), config => config.key === key);
    }

    public getConfiguration(type: VisualizationType): IVisualizationConfiguration {
        if (Assessments.isValidType(type)) {
            const assessment = Assessments.forType(type);
            const defaults = {
                testMode: TestMode.Assessments,
                chromeCommand: null,
                detailsViewStaticContent: null,
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

        const configuration = this.configurationByType[type];

        if (configuration == null) {
            throw new Error(`Unsupported type: ${type}`);
        }

        return configuration;
    }

    public getChromeCommandToVisualizationTypeMap(): IDictionaryStringTo<VisualizationType> {
        const map: IDictionaryStringTo<VisualizationType> = {};

        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);

        _.each(types, type => {
            const configuration = this.configurationByType[type];

            if (configuration && configuration.chromeCommand != null) {
                map[configuration.chromeCommand] = type;
            }
        });

        return map;
    }
}
