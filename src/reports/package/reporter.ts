// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CombinedResultsReport } from 'reports/package/combined-results-report';
import { SummaryResultsReport } from 'reports/package/summary-results-report';
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { AxeResultsReport } from './axe-results-report';

export type AxeResultsReportGenerator =
    (parameters: AccessibilityInsightsReport.AxeReportParameters) => AxeResultsReport;
export type SummaryResultsReportGenerator =
    (parameters: AccessibilityInsightsReport.SummaryReportParameters) => SummaryResultsReport;
export type CombinedReportGenerator =
    (parameters: AccessibilityInsightsReport.CombinedReportParameters) => CombinedResultsReport;

export class Reporter implements AccessibilityInsightsReport.Reporter {
    constructor(
        private readonly axeResultsReportGenerator: AxeResultsReportGenerator,
        private readonly summaryResultsReportGenerator: SummaryResultsReportGenerator,
        private readonly combinedResultsReportGenerator: CombinedReportGenerator,
    ) { }

    public fromAxeResult(
        parameters: AccessibilityInsightsReport.AxeReportParameters
    ): AxeResultsReport {
        return this.axeResultsReportGenerator(parameters);
    }

    public fromSummaryResults(
        parameters: AccessibilityInsightsReport.SummaryReportParameters
    ): SummaryResultsReport {
        return this.summaryResultsReportGenerator(parameters);
    }

    public fromCombinedResults(
        parameters: AccessibilityInsightsReport.CombinedReportParameters
    ): AccessibilityInsightsReport.Report {
        return this.combinedResultsReportGenerator(parameters);
    }
}
