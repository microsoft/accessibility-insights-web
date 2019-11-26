// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { AxeResultsReport } from './axe-results-report';

export type AxeResultsReportGenerator = (parameters: AccessibilityInsightsReport.AxeReportParameters) => AxeResultsReport;

export class Reporter implements AccessibilityInsightsReport.Reporter {
    constructor(private readonly axeResultsReportGenerator: AxeResultsReportGenerator) { }

    public fromAxeResult(parameters: AccessibilityInsightsReport.AxeReportParameters): AxeResultsReport {
        return this.axeResultsReportGenerator(parameters);
    }
}
