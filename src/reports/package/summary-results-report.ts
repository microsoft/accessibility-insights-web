// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {  ToolData, ScanMetadata } from 'common/types/store-data/unified-data-interface';
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { SummaryReportHtmlGenerator } from 'reports/summary-report-html-generator';
import { ScanTimespan } from 'reports/components/report-sections/summary-report-section-factory';

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

        const scanMetadata: ScanMetadata = {
            targetAppInfo: targetAppInfo,
            toolData: this.toolInfo,
            timestamp: null,
        };

        const timespan: ScanTimespan = {
            scanStart: scanDetails.scanStart,
            scanComplete: scanDetails.scanComplete,
            durationSeconds: scanDetails.durationSeconds,
        }

        const html = reportHtmlGenerator.generateHtml(
            timespan,
            scanMetadata,
            results,
        );

        return html;
    }
}
