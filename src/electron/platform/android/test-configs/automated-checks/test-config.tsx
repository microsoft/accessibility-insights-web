// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { sharedScanResultsStartOverButtonSettings } from 'electron/platform/android/test-configs/shared-scan-results/start-over-button-settings';
import { TestConfig } from 'electron/types/test-config';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import * as React from 'react';
import { automatedChecksResultsFilter } from './results-filter';

export const automatedChecksTestConfig: TestConfig = {
    key: 'automated-checks',
    contentPageInfo: {
        title: 'Automated checks',
        description: (
            <p>
                Automated checks can detect some common accessibility problems such as missing or
                invalid properties. But most accessibility problems can only be discovered through
                manual testing.
            </p>
        ),
        instancesSectionComponent: FailedInstancesSection,
        resultsFilter: automatedChecksResultsFilter,
        allowsExportReport: true,
        visualHelperSection: ScreenshotView,
        startOverButtonSettings: sharedScanResultsStartOverButtonSettings,
    },
};
