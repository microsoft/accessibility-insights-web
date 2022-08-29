// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { Messages } from 'common/messages';
import { AdHocTestkeys } from 'common/types/store-data/adhoc-test-keys';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { adhoc as content } from 'content/adhoc';
import { createHowToTest } from 'content/adhoc/tabstops/how-to-test';
import { FocusAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';

const { guidance, extraGuidance } = content.tabstops;
const tabStopsTestKey = AdHocTestkeys.TabStops;

const tabStopVisualizationConfiguration: FocusAnalyzerConfiguration = {
    key: tabStopsTestKey,
    testType: VisualizationType.TabStops,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
    analyzerProgressMessageType: Messages.Visualizations.TabStops.TabbedElementAdded,
    analyzerTerminatedMessageType: Messages.Visualizations.TabStops.TerminateScan,
};

export const TabStopsAdHocVisualization: VisualizationConfiguration = {
    key: tabStopsTestKey,
    testMode: TestMode.Adhoc,
    testViewType: 'AdhocTabStops',
    testViewOverrides: {
        content: createHowToTest(2),
        guidance: extraGuidance,
    },
    getStoreData: data => data.adhoc[tabStopsTestKey],
    enableTest: (data, _) => (data.adhoc[tabStopsTestKey].enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    shouldShowExportReport: () => true,
    displayableData: {
        title: 'Tab stops',
        enableMessage: 'Start pressing Tab to start visualizing tab stops.',
        toggleLabel: 'Show tab stops',
        linkToDetailsViewText: 'How to test tab stops',
    },
    chromeCommand: '04_toggle-tabStops',
    launchPanelDisplayOrder: 4,
    adhocToolsPanelDisplayOrder: 6,
    analyzerProgressMessageType: Messages.Visualizations.TabStops.TabbedElementAdded,
    analyzerTerminatedMessageType: Messages.Visualizations.TabStops.TerminateScan,
    getAnalyzer: provider => provider.createTabStopsAnalyzer(tabStopVisualizationConfiguration),
    getIdentifier: () => tabStopsTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getDrawer: provider => provider.createSVGDrawer(),
    getNotificationMessage: selectorMap => 'Start pressing Tab to start visualizing tab stops.',
    getSwitchToTargetTabOnScan: () => true,
    getInstanceIdentiferGenerator: () => generateUID,
    guidance,
};
