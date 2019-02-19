// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';
import * as React from 'react';

import { AdHocTestkeys } from '../../common/configs/adhoc-test-keys';
import { TestMode } from '../../common/configs/test-mode';
import { IVisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { Messages } from '../../common/messages';
import { TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { VisualizationType } from '../../common/types/visualization-type';
import { generateUID } from '../../common/uid-generator';
import { adhoc as content } from '../../content/adhoc';
import { AdhocStaticTestView } from '../../DetailsView/components/adhoc-static-test-view';
import { headingsContent } from '../../DetailsView/StaticContent/headings-details-view';
import { VisualizationInstanceProcessor } from '../../injected/visualization-instance-processor';
import { ScannerUtils } from './../../injected/scanner-utils';

const { guidance, staticContent } = content.headings;

export const HeadingsAdHocVisualization: IVisualizationConfiguration = {
    getTestView: props => <AdhocStaticTestView {...props} />,
    key: AdHocTestkeys.Headings,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc.headings,
    enableTest: (data, _) => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Headings',
        enableMessage: 'Finding headings...',
        toggleLabel: 'Show headings',
        linkToDetailsViewText: 'How to test headings',
    },
    detailsViewStaticContent: headingsContent,
    detailsViewContent: staticContent,
    chromeCommand: '03_toggle-headings',
    launchPanelDisplayOrder: 3,
    adhocToolsPanelDisplayOrder: 3,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
    resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
    getAnalyzer: provider =>
        provider.createRuleAnalyzer({
            rules: ['heading-order'],
            resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
            telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forTestScan,
            key: AdHocTestkeys.Headings,
            testType: VisualizationType.Headings,
            analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
        }),
    getIdentifier: () => AdHocTestkeys.Headings,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap => (_.isEmpty(selectorMap) ? 'No headings found' : null),
    getDrawer: provider => provider.createHeadingsDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    getUpdateVisibility: () => false,
    guidance,
};
