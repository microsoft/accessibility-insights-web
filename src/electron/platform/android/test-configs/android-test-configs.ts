// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { automatedChecksTestConfig } from 'electron/platform/android/test-configs/automated-checks/test-config';
import { needsReviewTestConfig } from 'electron/platform/android/test-configs/needs-review/test-config';
import { tabStopsTestConfig } from 'electron/platform/android/test-configs/tab-stops/test-config';
import { TestConfig } from 'electron/types/test-config';

export const androidTestConfigs: TestConfig[] = [
    automatedChecksTestConfig,
    tabStopsTestConfig,
    needsReviewTestConfig,
];
