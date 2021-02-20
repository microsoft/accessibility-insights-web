// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { StartOverButtonTabSettings } from 'electron/types/content-page-info';
import { TestConfig } from 'electron/types/test-config';
import { ReflowCommandBarProps } from 'electron/views/results/components/reflow-command-bar';
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
        startOverButtonTabSettings(props: ReflowCommandBarProps): StartOverButtonTabSettings {
            return {
                onClick: () => props.deps.scanActionCreator.scan(props.scanPort),
                disabled: props.scanStoreData.status === ScanStatus.Scanning,
            };
        },
    },
};
