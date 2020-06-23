// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdHocTestkeys } from 'common/configs/adhoc-test-keys';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { FeatureFlags } from 'common/feature-flags';
import { Messages } from 'common/messages';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { AdhocIssuesTestView } from 'DetailsView/components/adhoc-issues-test-view';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';

export const NeedsReviewAdHocVisualization: VisualizationConfiguration = {
    key: AdHocTestkeys.NeedsReview,
    testMode: TestMode.Adhoc,
    getTestView: props => <AdhocIssuesTestView {...props} />,
    getStoreData: data => data.adhoc.needsReview,
    enableTest: data => (data.enabled = true),
    disableTest: data => (data.enabled = false),
    getTestStatus: data => data.enabled,
    displayableData: {
        title: 'Needs Review',
        enableMessage: 'Running needs review checks...',
        toggleLabel: 'Show areas needing review',
        linkToDetailsViewText: 'List view and filtering',
    },
    launchPanelDisplayOrder: 6,
    adhocToolsPanelDisplayOrder: 6,
    getAnalyzer: provider =>
        provider.createBaseAnalyzer({
            key: AdHocTestkeys.Color,
            testType: VisualizationType.Color,
            analyzerMessageType: Messages.Visualizations.Common.ScanCompleted,
        }),
    getIdentifier: () => AdHocTestkeys.NeedsReview,
    visualizationInstanceProcessor: () => VisualizationInstanceProcessor.nullProcessor,
    getNotificationMessage: null,
    getDrawer: () => null,
    getSwitchToTargetTabOnScan: () => false,
    getInstanceIdentiferGenerator: () => generateUID,
    featureFlagToEnable: FeatureFlags.needsReview,
};
