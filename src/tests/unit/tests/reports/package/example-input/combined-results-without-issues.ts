// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CombinedReportParameters } from "reports/package/accessibilityInsightsReport";

export const combinedResultsWithoutIssues: CombinedReportParameters = {
    serviceName: 'Mock Service Name',
    axeVersion: 'mock.axe.version',
    scanDetails: {
        basePageTitle: 'Mock base without failures or unscannables',
        baseUrl: 'https://example.com/mock-base-url',
        scanStart: new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), // Jan 2 2020, 03:04:05am
        scanComplete: new Date(Date.UTC(2020, 1, 2, 4, 4, 5)), // Jan 2 2020, 04:04:05am
        durationSeconds: 1 * 60 * 60,
    },
    userAgent: 'Mock user agent',
    results: {
        resultsByRule: {
            failed: [],
            passed: [],
            notApplicable: []
        }
    }
};
