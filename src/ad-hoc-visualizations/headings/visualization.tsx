// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { adhoc as content } from 'content/adhoc';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { ScannerUtils } from 'injected/scanner-utils';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import { isEmpty } from 'lodash';

const { guidance } = content.headings;
const headingsTestKey = AdHocTestkeys.Headings;

const headingsRuleAnalyzerConfiguration: RuleAnalyzerConfiguration = {
    rules: ['heading-order'],
    resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
    telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forTestScan,
    key: headingsTestKey,
    testType: VisualizationType.Headings,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
};

export const HeadingsAdHocVisualization: VisualizationConfiguration = {
    testViewType: 'AdhocStatic',
    key: headingsTestKey,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc[headingsTestKey],
    enableTest: data => (data.adhoc[headingsTestKey].enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    shouldShowExportReport: () => false,
    displayableData: {
        title: 'Headings',
        enableMessage: 'Finding headings...',
        toggleLabel: 'Show headings',
        linkToDetailsViewText: 'How to test headings',
    },
    chromeCommand: '03_toggle-headings',
    launchPanelDisplayOrder: 3,
    adhocToolsPanelDisplayOrder: 3,
    getAnalyzer: provider => provider.createRuleAnalyzer(headingsRuleAnalyzerConfiguration),
    getIdentifier: () => headingsTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap => (isEmpty(selectorMap) ? 'No headings found' : null),
    getDrawer: provider => provider.createHeadingsDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    guidance,
};
