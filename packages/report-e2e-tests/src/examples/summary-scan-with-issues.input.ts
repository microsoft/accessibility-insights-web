// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SummaryReportParameters } from 'accessibility-insights-report';

export const summaryScanWithIssues: SummaryReportParameters = {
    serviceName: 'Mock Service Name',
    axeVersion: 'mock.axe.version',
    scanDetails: {
        basePageTitle: 'Mock base with failures and unscannables',
        baseUrl: 'https://example.com/mock-base-url',
        scanStart: new Date(Date.UTC(2020, 1, 2, 3, 4, 5)), // Jan 2 2020, 03:04:05am
        scanComplete: new Date(Date.UTC(2020, 1, 2, 4, 4, 5)), // Jan 2 2020, 04:04:05am
        durationSeconds: 1 * 60 * 60,
    },
    userAgent: 'Mock user agent',
    browserResolution: '1920x1080',
    results: {
        failed: [
            {
                numFailures: 1,
                reportLocation: './has-1-failure1.html',
                url: 'https://example.com/mock-base-url/has-1-failure',
            },
            {
                numFailures: 5,
                reportLocation: './has-5-failures.html',
                url: 'https://example.com/mock-base-url/has-5-failures',
            },
        ],
        passed: [
            {
                numFailures: 0,
                reportLocation: './passes.html',
                url: 'https://example.com/mock-base-url/passes',
            },
        ],
        unscannable: [
            {
                errorType: 'MockErrorType',
                errorDescription: 'Mock unscannable error description',
                errorLogLocation: './error-log.txt',
                url: 'https://example.com/mock-base-url/unscannable',
            },
        ],
    },
};
