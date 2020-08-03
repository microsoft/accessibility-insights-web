// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { Messages } from 'common/messages';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { adhoc as content } from 'content/adhoc';
import { createHowToTest } from 'content/adhoc/tabstops/how-to-test';
import { AdhocStaticTestView } from 'DetailsView/components/adhoc-static-test-view';
import { FocusAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';

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
    getTestView: props => (
        <AdhocStaticTestView content={createHowToTest(2)} guidance={extraGuidance} {...props} />
    ),
    key: tabStopsTestKey,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc[tabStopsTestKey],
    enableTest: (data, _) => (data.adhoc[tabStopsTestKey].enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Tab stops',
        enableMessage: 'Start pressing Tab to start visualizing tab stops.',
        toggleLabel: 'Show tab stops',
        linkToDetailsViewText: 'How to test tab stops',
    },
    chromeCommand: '04_toggle-tabStops',
    launchPanelDisplayOrder: 4,
    adhocToolsPanelDisplayOrder: 5,
    analyzerProgressMessageType: Messages.Visualizations.TabStops.TabbedElementAdded,
    analyzerTerminatedMessageType: Messages.Visualizations.TabStops.TerminateScan,
    getAnalyzer: provider =>
        provider.createFocusTrackingAnalyzer(tabStopVisualizationConfiguration),
    getIdentifier: () => tabStopsTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getDrawer: provider => provider.createSVGDrawer(),
    getNotificationMessage: selectorMap => 'Start pressing Tab to start visualizing tab stops.',
    getSwitchToTargetTabOnScan: () => true,
    getInstanceIdentiferGenerator: () => generateUID,
    guidance,
};
