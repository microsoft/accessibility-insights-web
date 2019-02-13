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
import { AdhocIssuesTestView, IAdhocIssuesTestViewProps } from '../../DetailsView/components/adhoc-issues-test-view';
import { VisualizationInstanceProcessor } from '../../injected/visualization-instance-processor';
import { ScannerUtils } from './../../injected/scanner-utils';

export const IssuesAdHocVisualization: IVisualizationConfiguration = {
    key: AdHocTestkeys.Issues,
    testMode: TestMode.Adhoc,
    getTestView: props => <AdhocIssuesTestView {...props} />,
    getStoreData: data => data.adhoc.issues,
    enableTest: (data, _) => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Automated checks',
        enableMessage: 'Running automated checks...',
        toggleLabel: 'Show failures',
        linkToDetailsViewText: 'List view and filtering',
    },
    detailsViewStaticContent: null,
    chromeCommand: '01_toggle-issues',
    launchPanelDisplayOrder: 1,
    adhocToolsPanelDisplayOrder: 1,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
    resultProcessor: (scanner: ScannerUtils) => scanner.getFailingInstances,
    getAnalyzer: provider =>
        provider.createRuleAnalyzer({
            rules: null,
            resultProcessor: (scanner: ScannerUtils) => scanner.getFailingInstances,
            telemetryProcessor: (telemetryFactory: TelemetryDataFactory) => telemetryFactory.forIssuesAnalyzerScan,
            key: AdHocTestkeys.Issues,
            testType: VisualizationType.Issues,
            analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
        }),
    getIdentifier: () => AdHocTestkeys.Issues,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: selectorMap =>
        _.isEmpty(selectorMap) ? 'Congratulations!\n\nAutomated checks found no issues on this page.' : null,
    getDrawer: provider => provider.createIssuesDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    getUpdateVisibility: () => false,
};
