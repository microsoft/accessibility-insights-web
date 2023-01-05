// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IColumn } from '@fluentui/react';
import { UniquelyIdentifiableInstances } from 'background/instance-identifier-generator';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import {
    AssessmentData,
    AssessmentNavState,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { Analyzer, AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { VisualizationInstanceProcessorCallback } from 'injected/visualization-instance-processor';
import { Drawer } from 'injected/visualization/drawer';
import { DrawerProvider } from 'injected/visualization/drawer-provider';
import { DictionaryStringTo } from 'types/common-types';
import { ContentPageComponent } from 'views/content/content-page';
import { IGetMessageGenerator } from '../assessment-default-message-generator';
import { InstanceTableColumn, InstanceTableHeaderType } from './instance-table-data';
import { ReportInstanceFields } from './report-instance-field';

export interface Requirement {
    key: string;
    description: JSX.Element;
    order?: number;
    name: string;
    renderStaticContent?: () => JSX.Element;
    howToTest: JSX.Element;
    addFailureInstruction?: string;
    infoAndExamples?: ContentPageComponent;
    whyItMatters?: ContentPageComponent;
    isManual: boolean;
    // This is for semi-manual cases where we can't present a list of instances like an assisted
    // test would, but can infer a PASS or FAIL state. If not specified, acts like () => UNKNOWN.
    getInitialManualTestStatus?: (instances: InstanceIdToInstanceDataMap) => ManualTestStatus;
    guidanceLinks: HyperlinkDefinition[];
    columnsConfig?: InstanceTableColumn[];
    getAnalyzer?: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) => Analyzer;
    getVisualHelperToggle?: (props: VisualHelperToggleConfig) => JSX.Element;
    // Any results for which this returns false will be omitted from visual helper displays, but still
    // present for the purposes of instance lists or getInitialManualTestStatus. By default, all
    // results support visualization.
    isVisualizationSupportedForResult?: (result: DecoratedAxeNodeResult) => boolean;
    visualizationInstanceProcessor?: VisualizationInstanceProcessorCallback;
    getDrawer?: (provider: DrawerProvider, featureFlagStoreData?: FeatureFlagStoreData) => Drawer;
    getNotificationMessage?: (selectorMap: DictionaryStringTo<any>) => string;
    doNotScanByDefault?: boolean;
    switchToTargetTabOnScan?: boolean;
    generateInstanceIdentifier?: (instance: UniquelyIdentifiableInstances) => string;
    reportInstanceFields?: ReportInstanceFields;
    renderReportDescription?: () => JSX.Element;
    getInstanceStatus?: (result: DecoratedAxeNodeResult) => ManualTestStatus;
    getInstanceStatusColumns?: () => Readonly<IColumn>[];
    getDefaultMessage?: IGetMessageGenerator;
    instanceTableHeaderType?: InstanceTableHeaderType;
    getCompletedRequirementDetailsForTelemetry?: (assessmentData: AssessmentData) => any;
}

export type VisualHelperToggleConfigDeps = {
    getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator;
};

export interface VisualHelperToggleConfig {
    deps: VisualHelperToggleConfigDeps;
    assessmentNavState: AssessmentNavState;
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    isStepEnabled: boolean;
    isStepScanned: boolean;
}
