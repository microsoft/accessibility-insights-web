// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getNotificationMessage } from 'ad-hoc-visualizations/issues/get-notification-message';
import { NewTabLink } from 'common/components/new-tab-link';
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { Messages } from 'common/messages';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { RuleAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { ScannerUtils } from 'injected/scanner-utils';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';

const issuesTestKey = AdHocTestkeys.Issues;
const needsReviewTestKey = AdHocTestkeys.NeedsReview;

const issuesRuleAnalyzerConfiguration: RuleAnalyzerConfiguration = {
    rules: null,
    resultProcessor: (scanner: ScannerUtils) => scanner.getFailingInstances,
    telemetryProcessor: (telemetryFactory: TelemetryDataFactory) =>
        telemetryFactory.forIssuesAnalyzerScan,
    key: issuesTestKey,
    testType: VisualizationType.Issues,
    analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
};

export const IssuesAdHocVisualization: VisualizationConfiguration = {
    key: issuesTestKey,
    testMode: TestMode.Adhoc,
    testViewType: 'AdhocFailure',
    getStoreData: data => data.adhoc[issuesTestKey],
    enableTest: (data, _) => {
        data.adhoc[issuesTestKey].enabled = true;
        data.adhoc[needsReviewTestKey].enabled = false;
    },
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    shouldShowExportReport: data => data.results != null,
    displayableData: {
        title: 'Automated checks',
        subtitle: (
            <>
                Automated checks can detect some common accessibility problems such as missing or
                invalid properties. But most accessibility problems can only be discovered through
                manual testing. The best way to evaluate web accessibility compliance is to complete
                an{' '}
                <NewTabLink href="https://accessibilityinsights.io/docs/en/web/getstarted/assessment">
                    assessment
                </NewTabLink>
                .
            </>
        ),
        enableMessage: 'Running automated checks...',
        toggleLabel: 'Show failures',
        linkToDetailsViewText: 'List view and filtering',
    },
    chromeCommand: '01_toggle-issues',
    launchPanelDisplayOrder: 1,
    adhocToolsPanelDisplayOrder: 1,
    getAnalyzer: provider =>
        provider.createRuleAnalyzerUnifiedScan(issuesRuleAnalyzerConfiguration),
    getIdentifier: () => issuesTestKey,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: (selectorMap, key, warnings) =>
        getNotificationMessage(selectorMap, warnings),
    getDrawer: provider => provider.createIssuesDrawer(),
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
};
