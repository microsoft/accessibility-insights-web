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
import { AdhocStaticTestView } from 'DetailsView/components/adhoc-static-test-view';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { ScannerUtils } from 'injected/scanner-utils';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';

const { guidance } = content.color;
const colorTestKey = AdHocTestkeys.Color;

const colorRuleAnalyzerConfiguration: RuleAnalyzerConfiguration = {
    rules: ['select-body'],
    resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
    telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forTestScan,
    key: colorTestKey,
    testType: VisualizationType.Color,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
};

export const ColorAdHocVisualization: VisualizationConfiguration = {
    getTestView: props => <AdhocStaticTestView {...props} />,
    key: colorTestKey,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc[colorTestKey],
    enableTest: (data, _) => (data.adhoc[colorTestKey].enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Color',
        enableMessage: 'Changing color to greyscale...',
        toggleLabel: 'Show grayscale',
        linkToDetailsViewText: 'How to test color',
    },
    chromeCommand: '05_toggle-color',
    launchPanelDisplayOrder: 5,
    adhocToolsPanelDisplayOrder: 2,
    getAnalyzer: provider => provider.createRuleAnalyzer(colorRuleAnalyzerConfiguration),
    getIdentifier: () => colorTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap => null,
    getDrawer: provider => provider.createSingleTargetDrawer('insights-grey-scale-container'),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    guidance,
};
