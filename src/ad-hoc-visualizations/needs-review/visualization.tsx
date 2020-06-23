// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { generateUID } from 'common/uid-generator';
import { AdhocIssuesTestView } from 'DetailsView/components/adhoc-issues-test-view';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';
import { FeatureFlags } from 'common/feature-flags';

export const NeedsReviewAdHocVisualization: VisualizationConfiguration = {
    key: AdHocTestkeys.NeedsReview,
    testMode: TestMode.Adhoc,
    getTestView: props => <AdhocIssuesTestView {...props} />,
    getStoreData: data => data.adhoc.needsReview,
    enableTest: (data, _) => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Needs Review',
        enableMessage: 'Running needs review checks...',
        toggleLabel: 'Show areas needing review',
        linkToDetailsViewText: 'List view and filtering',
    },
    chromeCommand: '01_toggle-issues',
    launchPanelDisplayOrder: 6,
    adhocToolsPanelDisplayOrder: 6,
    getAnalyzer: () => null,
    getIdentifier: () => AdHocTestkeys.NeedsReview,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: null,
    getDrawer: () => null,
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    featureFlagToEnable: FeatureFlags.needsReview,
};
