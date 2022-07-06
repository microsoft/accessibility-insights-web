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
const accessiblenamesTestKey = AdHocTestkeys.AccessibleNames;

const headingsRuleAnalyzerConfiguration: RuleAnalyzerConfiguration = {
    rules: ['collect-headings'],
    resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
    telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forTestScan,
    key: accessiblenamesTestKey,
    testType: VisualizationType.Headings,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
};

export const AccessibleNamesAdHocVisualization: VisualizationConfiguration = {
    testViewType: 'AdhocStatic',
    key: accessiblenamesTestKey,
    testMode: TestMode.Adhoc,
    featureFlagToEnable: 'showAccessibleNames',
    getStoreData: data => data.adhoc[accessiblenamesTestKey],
    enableTest: data => (data.adhoc[accessiblenamesTestKey].enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    shouldShowExportReport: () => false,
    displayableData: {
        title: 'Accessible Names',
        enableMessage: 'Calculating accessible names...',
        toggleLabel: 'Show accessiblenames',
        linkToDetailsViewText: 'How to test accessible names',
    },
    chromeCommand: '07_toggle-accessibleNames',
    launchPanelDisplayOrder: 2,
    adhocToolsPanelDisplayOrder: 4,
    getAnalyzer: provider => provider.createRuleAnalyzer(headingsRuleAnalyzerConfiguration),
    getIdentifier: () => accessiblenamesTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap => (isEmpty(selectorMap) ? 'No headings found' : null),
    getDrawer: provider => provider.createHeadingsDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    guidance,
};
