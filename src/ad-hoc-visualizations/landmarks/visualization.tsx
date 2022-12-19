// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { AdHocTestkeys } from 'common/types/store-data/adhoc-test-keys';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { adhoc as content } from 'content/adhoc';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { ScannerUtils } from 'injected/scanner-utils';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import { isEmpty } from 'lodash';

const { guidance } = content.landmarks;
const landmarksTestKey = AdHocTestkeys.Landmarks;

const landmarkRuleAnalyzerConfiguration: RuleAnalyzerConfiguration = {
    rules: ['unique-landmark'],
    resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
    telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forTestScan,
    key: landmarksTestKey,
    testType: VisualizationType.Landmarks,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
};

export const LandmarksAdHocVisualization: VisualizationConfiguration = {
    testViewType: 'AdhocStatic',
    key: landmarksTestKey,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc[landmarksTestKey],
    enableTest: (data, _) => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    shouldShowExportReport: () => false,
    displayableData: {
        title: 'Landmarks',
        adHoc: {
            enableMessage: 'Finding landmarks...',
            toggleLabel: 'Show landmarks',
            linkToDetailsViewText: 'How to test landmarks',
        },
    },
    chromeCommand: '02_toggle-landmarks',
    launchPanelDisplayOrder: 2,
    adhocToolsPanelDisplayOrder: 5,
    getAnalyzer: provider => provider.createRuleAnalyzer(landmarkRuleAnalyzerConfiguration),
    getIdentifier: () => landmarksTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap => (isEmpty(selectorMap) ? 'No landmarks found' : null),
    getDrawer: provider => provider.createLandmarksDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    guidance,
};
