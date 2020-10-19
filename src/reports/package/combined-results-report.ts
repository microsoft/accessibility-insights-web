// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';
import { ScanTimespan } from 'reports/components/report-sections/base-summary-report-section-props';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';

export type CombinedResultsReportDeps = {
    reportHtmlGenerator: CombinedReportHtmlGenerator;
};

export class CombinedResultsReport implements AccessibilityInsightsReport.Report {
    constructor(private readonly deps: CombinedResultsReportDeps) {}

    public asHTML(): string {
        return this.deps.reportHtmlGenerator.generateHtml({} as ScanTimespan, {} as ScanMetadata);
    }
}
