// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UniquelyIdentifiableInstances } from 'background/instance-identifier-generator';
import { ManualTestStatus } from 'common/types/manual-test-status';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    InstanceIdToInstanceDataMap,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentInstanceRowData,
    AssessmentInstanceTable,
} from 'DetailsView/components/assessment-instance-table';
import { Analyzer } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import {
    PropertyBags,
    VisualizationInstanceProcessorCallback,
} from 'injected/visualization-instance-processor';
import { Drawer } from 'injected/visualization/drawer';
import { DrawerProvider } from 'injected/visualization/drawer-provider';
import { IColumn } from 'office-ui-fabric-react';
import { DictionaryStringTo } from 'types/common-types';
import { ContentPageComponent, HyperlinkDefinition } from 'views/content/content-page';
import { IGetMessageGenerator } from '../assessment-default-message-generator';
import { InstanceTableColumn } from './instance-table-column';
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
    isManual: boolean;
    // This is for semi-manual cases where we can't present a list of instances like an assisted
    // test would, but can infer a PASS or FAIL state. If not specified, acts like () => UNKNOWN.
    getInitialManualTestStatus?: (instances: InstanceIdToInstanceDataMap) => ManualTestStatus;
    guidanceLinks: HyperlinkDefinition[];
    columnsConfig?: InstanceTableColumn[];
    getAnalyzer?: (provider: AnalyzerProvider) => Analyzer;
    getVisualHelperToggle?: (props: VisualHelperToggleConfig) => JSX.Element;
    // Any results this returns false for will be omitted from visual helper displays, but still
    // present for the purposes of instance lists or getInitialManualTestStatus. By default, all
    // results support visualization.
    isVisualizationSupportedForResult?: (result: DecoratedAxeNodeResult) => boolean;
    visualizationInstanceProcessor?: VisualizationInstanceProcessorCallback<
        PropertyBags,
        PropertyBags
    >;
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
    renderInstanceTableHeader?: (
        table: AssessmentInstanceTable,
        items: AssessmentInstanceRowData[],
    ) => JSX.Element;
}

export type VisualHelperToggleConfigDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface VisualHelperToggleConfig {
    deps: VisualHelperToggleConfigDeps;
    assessmentNavState: AssessmentNavState;
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    isStepEnabled: boolean;
    isStepScanned: boolean;
}
