// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SummaryReportParameters } from 'accessibility-insights-report';

export const summaryScanWithoutIssues: SummaryReportParameters = {
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
    browserResolution: '1920x1080',
    results: {
        failed: [],
        passed: [
            {
                numFailures: 0,
                reportLocation: './passes-a.html',
                url: 'https://example.com/mock-base-url/passes-a',
            },
            {
                numFailures: 0,
                reportLocation: './passes-b.html',
                url: 'https://example.com/mock-base-url/passes-b',
            },
        ],
        unscannable: [],
    },
};
