// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata, ScanTimespan, ToolData } from 'common/types/store-data/unified-data-interface';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';
import { CombinedResultsToCardsModelConverter } from 'reports/package/combined-results-to-cards-model-converter';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

export type CombinedResultsReportDeps = {
    reportHtmlGenerator: CombinedReportHtmlGenerator;
};

export class CombinedResultsReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly deps: CombinedResultsReportDeps,
        private readonly parameters: AccessibilityInsightsReport.CombinedReportParameters,
        private readonly toolInfo: ToolData,
        private readonly resultsToCardsConverter: CombinedResultsToCardsModelConverter
    ) {}

    public asHTML(): string {
        const { scanDetails, results } = this.parameters;

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

        const cardsByRule = this.resultsToCardsConverter.convertResults(
            results.resultsByRule
        );

        return this.deps.reportHtmlGenerator.generateHtml(
            scanMetadata,
            cardsByRule,
            results.urlResults
        );
    }
}
