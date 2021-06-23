// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axios from 'axios';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { AndroidScanResults } from './android-scan-results';

export type ScanResultsFetcher = (port: number) => Promise<AndroidScanResults>;

export type HttpGet = typeof axios.get;

export const createScanResultsFetcher = (
    httpGet: HttpGet,
    featureFlagStore: FeatureFlagStore,
): ScanResultsFetcher => {
    return async (port: number) => {
        const featureFlagStoreData = featureFlagStore.getState();
        let resultsVersion = ''; // API for v1 results doesn't have an explicit version number
        if (featureFlagStoreData[UnifiedFeatureFlags.atfaResults]) {
            resultsVersion = '_v2';
        }

        const response = await httpGet(
            `http://localhost:${port}/AccessibilityInsights/result${resultsVersion}`,
        );
        return new AndroidScanResults(response.data);
    };
};
