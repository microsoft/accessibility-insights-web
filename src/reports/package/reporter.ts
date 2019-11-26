// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { AxeResultsReport } from './axe-results-report';

export type AxeResultsReportGenerator = (request: AccessibilityInsightsReport.AxeReportRequest) => AxeResultsReport;

export class Reporter implements AccessibilityInsightsReport.Reporter {
    constructor(private readonly axeResultsReportGenerator: AxeResultsReportGenerator) { }

    public fromAxeResult(request: AccessibilityInsightsReport.AxeReportRequest): AxeResultsReport {
        return this.axeResultsReportGenerator(request);
    }
}
