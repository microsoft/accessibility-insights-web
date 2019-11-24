// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { AxeResultReport } from './axe-results-report';

export type AxeResultsReportGenerator = (results: axe.AxeResults, options: AccessibilityInsightsReport.ReportOptions) => AxeResultReport;

export class Reporter implements AccessibilityInsightsReport.Reporter {
    constructor(private readonly axeResultsReportGenerator: AxeResultsReportGenerator) {}

    public fromAxeResult(results: axe.AxeResults, options: AccessibilityInsightsReport.ReportOptions): AxeResultReport {
        return this.axeResultsReportGenerator(results, options);
    }
}
