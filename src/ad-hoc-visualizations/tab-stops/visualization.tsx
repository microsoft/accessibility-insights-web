// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AdHocTestkeys } from '../../common/configs/adhoc-test-keys';
import { TestMode } from '../../common/configs/test-mode';
import { IVisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { Messages } from '../../common/messages';
import { VisualizationType } from '../../common/types/visualization-type';
import { generateUID } from '../../common/uid-generator';
import { adhoc as content } from '../../content/adhoc';
import { AdhocStaticTestView } from '../../DetailsView/components/adhoc-static-test-view';
import { VisualizationInstanceProcessor } from '../../injected/visualization-instance-processor';

const { guidance, extraGuidance, staticContent } = content.tabstops;
export const TabStopsAdHocVisualization: IVisualizationConfiguration = {
    getTestView: props => <AdhocStaticTestView content={staticContent} guidance={extraGuidance} {...props} />,
    key: AdHocTestkeys.TabStops,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc.tabStops,
    enableTest: (data, _) => (data.enabled = true),
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
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
    analyzerProgressMessageType: Messages.Visualizations.TabStops.TabbedElementAdded,
    analyzerTerminatedMessageType: Messages.Visualizations.TabStops.TerminateScan,
    getAnalyzer: provider =>
        provider.createFocusTrackingAnalyzer({
            key: AdHocTestkeys.TabStops,
            testType: VisualizationType.TabStops,
            analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
            analyzerProgressMessageType: Messages.Visualizations.TabStops.TabbedElementAdded,
            analyzerTerminatedMessageType: Messages.Visualizations.TabStops.TerminateScan,
        }),
    getIdentifier: () => AdHocTestkeys.TabStops,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getDrawer: provider => provider.createSVGDrawer(),
    getNotificationMessage: selectorMap => 'Start pressing Tab to start visualizing tab stops.',
    getSwitchToTargetTabOnScan: () => true,
    getInstanceIdentiferGenerator: () => generateUID,
    getUpdateVisibility: () => false,
    guidance,
};
