// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {  ToolData, ScanMetadata } from 'common/types/store-data/unified-data-interface';
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { SummaryReportHtmlGenerator } from 'reports/summary-report-html-generator';

export type SummaryResultsReportDeps = {
    reportHtmlGenerator: SummaryReportHtmlGenerator;
};

export class SummaryResultsReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly deps: SummaryResultsReportDeps,
        private readonly parameters: AccessibilityInsightsReport.SummaryReportParameters,
        private readonly toolInfo: ToolData,
    ) { }

    public asHTML(): string {
        const reportHtmlGenerator = this.deps.reportHtmlGenerator;
        const { results, crawlDetails } = this.parameters;

        const targetAppInfo = {
            name: null,
            url: crawlDetails.baseUrl,
        };

        const scanMetadata: ScanMetadata = {
            targetAppInfo: targetAppInfo,
            toolData: this.toolInfo,
            timestamp: null,
        };

        const html = reportHtmlGenerator.generateHtml(
            crawlDetails,
            scanMetadata,
            results,
        );

        return html;
    }
}
