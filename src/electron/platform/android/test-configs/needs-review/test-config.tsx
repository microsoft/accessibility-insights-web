// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { sharedScanResultsStartOverButtonSettings } from 'electron/platform/android/test-configs/shared-scan-results/start-over-button-settings';
import { TestConfig } from 'electron/types/test-config';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import * as React from 'react';
import { needsReviewResultsFilter } from './results-filter';

export const needsReviewTestConfig: TestConfig = {
    key: 'needs-review',
    contentPageInfo: {
        title: 'Needs review',
        description: (
            <p>
                Sometimes automated checks identify <i>possible</i> accessibility problems that need
                to be reviewed and verified by a human.
            </p>
        ),
        instancesSectionComponent: NeedsReviewInstancesSection,
        resultsFilter: needsReviewResultsFilter,
        allowsExportReport: false,
        visualHelperSection: ScreenshotView,
        startOverButtonSettings: sharedScanResultsStartOverButtonSettings,
    },
};
