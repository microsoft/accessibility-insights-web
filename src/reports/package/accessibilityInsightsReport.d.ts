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
        basePageTitle: string,
        scanStart: Date,
        scanComplete: Date,
        durationSeconds: number,
    }

    export type SummaryScanResult = {
        url: string,
        numFailures: number,
        reportLocation: string,
    }

    export type SummaryScanError = {
        url: string,
        errorType: string,
        errorDescription: string,
        errorLogLocation: string,
    }

    export type SummaryScanResults = {
        failed: SummaryScanResult[],
        passed: SummaryScanResult[],
        unscannable: SummaryScanError[],
    };

    export type SummaryReportParameters = {
        serviceName: string;
        axeVersion: string;
        userAgent: string;
        crawlDetails: CrawlSummaryDetails;
        results: SummaryScanResults;
    };

    export type Reporter = {
        fromAxeResult: (parameters: AxeReportParameters) => Report;
        fromSummaryResults: (parameters: SummaryReportParameters) => Report;
    };

    export type ReporterFactory = () => Reporter;

    export const reporterFactory: ReporterFactory;
}

export = AccessibilityInsightsReport;
