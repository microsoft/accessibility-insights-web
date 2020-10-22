// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import AccessibilityInsightsReport from './accessibilityInsightsReport';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';
import { ScanMetadata, ScanTimespan, ToolData } from 'common/types/store-data/unified-data-interface';

export type CombinedResultsReportDeps = {
    reportHtmlGenerator: CombinedReportHtmlGenerator;
};

export class CombinedResultsReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly deps: CombinedResultsReportDeps,
        private readonly parameters: AccessibilityInsightsReport.CombinedReportParameters,
        private readonly toolInfo: ToolData,
    ) {}

    public asHTML(): string {
        const { scanDetails } = this.parameters;

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
            timespan,
        };

        return this.deps.reportHtmlGenerator.generateHtml(scanMetadata);
    }
}
