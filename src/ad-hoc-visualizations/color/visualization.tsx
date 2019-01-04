// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
import { colorContent } from '../../DetailsView/StaticContent/color-details-view';
import { VisualizationInstanceProcessor } from '../../injected/visualization-instance-processor';
import { ScannerUtils } from './../../injected/scanner-utils';

const { guidance } = content.color;
export const ColorAdHocVisualization: IVisualizationConfiguration = {
    getTestView: props => <AdhocStaticTestView {...props} />,
    key: AdHocTestkeys.Color,
    testMode: TestMode.Adhoc,
    getStoreData: data => data.adhoc.color,
    enableTest: (data, _) => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Color',
        enableMessage: 'Changing color to greyscale...',
        toggleLabel: 'Show grayscale',
        linkToDetailsViewText: 'How to test color',
    },
    detailsViewStaticContent: colorContent,
    chromeCommand: '05_toggle-color',
    launchPanelDisplayOrder: 5,
    adhocToolsPanelDisplayOrder: 2,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
    resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
    getAnalyzer: provider =>
        provider.createRuleAnalyzer({
            rules: ['select-body'],
            resultProcessor: (scanner: ScannerUtils) => scanner.getAllCompletedInstances,
            telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forTestScan,
            key: AdHocTestkeys.Color,
            testType: VisualizationType.Color,
            analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
        }),
    getIdentifier: () => AdHocTestkeys.Color,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap => null,
    getDrawer: provider => provider.createColorDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    getUpdateVisibility: () => false,
    guidance,
};
