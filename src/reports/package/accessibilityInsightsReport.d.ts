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

    export type ScanSummaryDetails = {
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
        serviceName: string,
        axeVersion: string,
        userAgent: string,
        browserResolution: string,
        scanDetails: ScanSummaryDetails,
        results: SummaryScanResults,
    };

    export type AxeRuleData = {
        ruleId: string,
        tags: string[],
        description: string,
        ruleUrl: string
    }

    export interface FormattedCheckResult {
        id: string;
        message: string;
        data: any;
    }

    export type HowToFixData = {
        any: FormattedCheckResult[],
        all: FormattedCheckResult[],
        none: FormattedCheckResult[],
        failureSummary?: string,
    }

    export type FailureData = {
        urls: string[],
        elementSelector: string,
        snippet: string,
        fix: HowToFixData,
        rule: AxeRuleData
    };

    export interface FailuresGroup {
        key: string,
        failed: FailureData[],
    }

    export type GroupedResults = {
        failed: FailuresGroup[],
        passed?: AxeRuleData[],
        notApplicable?: AxeRuleData[],
    }

    export type UrlResultCounts = {
        passedUrls: number,
        failedUrls: number,
        unscannableUrls: number,
    }

    export type CombinedReportResults = {
        resultsByRule: GroupedResults,
        urlResults: UrlResultCounts,
    }

    export type CombinedReportParameters = {
        serviceName: string,
        axeVersion: string,
        userAgent: string,
        browserResolution: string,
        scanDetails: ScanSummaryDetails,
        results: CombinedReportResults,
    }

    export type Reporter = {
        fromAxeResult: (parameters: AxeReportParameters) => Report;
        fromSummaryResults: (parameters: SummaryReportParameters) => Report;
        fromCombinedResults: (parameters: CombinedReportParameters) => Report;
    };

    export type ReporterFactory = () => Reporter;

    export const reporterFactory: ReporterFactory;
}

export = AccessibilityInsightsReport;
