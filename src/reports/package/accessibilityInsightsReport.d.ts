// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';


declare namespace AccessibilityInsightsReport {
    export type Report = {
        asHTML(): string;
    };

    export type ScanContext = {
        pageTitle: string;
    };

    export type AxeReportParameters = {
        results: axe.AxeResults,
        description: string;
        serviceName: string;
        scanContext: ScanContext;
    }

    export type CrawlSummaryDetails = {
        baseUrl: string,
        scanStart: Date,
        scanComplete: Date,
        durationSeconds: number,
    }

    export type FailedScanResult = {
        url: string, // Should we have pageTitle? Maybe for accessibile link names?
        numFailures: number,
        reportLocation: string,
    }

    export type PassedScanResult = {
        url: string,
        reportLocation: string,
    }

    export type UnscannableScanResult = {
        url: string,
        errorType: string,
        errorDescription: string, // Link to error log?
    }

    export type CrawlSummaryReportParameters = {
        serviceName: string;
        crawlDetails: CrawlSummaryDetails;
        results: {
            failed: FailedScanResult[],
            passed: PassedScanResult[],
            unscannable: UnscannableScanResult[],
        }
    };

    export type Reporter = {
        fromAxeResult: (parameters: AxeReportParameters) => Report;
        fromCrawlResults: (parameters: CrawlSummaryReportParameters) => Report;
    };

    export type ReporterFactory = () => Reporter;

    export const reporterFactory: ReporterFactory;
}

export = AccessibilityInsightsReport;
