// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {  ToolData, ScanMetadata, ScanTimespan } from 'common/types/store-data/unified-data-interface';
import { SummaryReportHtmlGenerator } from 'reports/summary-report-html-generator';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

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
        const { results, scanDetails } = this.parameters;

        const targetAppInfo = {
            name: scanDetails.basePageTitle,
            url: scanDetails.baseUrl,
        };

        const timespan: ScanTimespan = {
            scanStart: scanDetails.scanStart,
            scanComplete: scanDetails.scanComplete,
            durationSeconds: scanDetails.durationSeconds,
        }

        const scanMetadata: ScanMetadata = {
            targetAppInfo: targetAppInfo,
            toolData: this.toolInfo,
            timespan: timespan,
        };

        const html = reportHtmlGenerator.generateHtml(
            scanMetadata,
            results,
        );

        return html;
    }
}
