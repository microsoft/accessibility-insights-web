// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';

export type CombinedResultsReportDeps = {
    reportHtmlGenerator: CombinedReportHtmlGenerator;
};

export class CombinedResultsReport implements AccessibilityInsightsReport.Report {
    constructor(private readonly deps: CombinedResultsReportDeps) {}

    public asHTML(): string {
        return this.deps.reportHtmlGenerator.generateHtml();
    }
}
