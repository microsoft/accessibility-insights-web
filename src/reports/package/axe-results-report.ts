// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import { ConvertScanResultsToUnifiedResultsDelegate } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { ResultDecorator } from 'scanner/result-decorator';

import { ReportHtmlGenerator } from '../report-html-generator';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

export type AxeResultsReportDeps = {
    reportHtmlGenerator: ReportHtmlGenerator;
    resultDecorator: ResultDecorator;
    getUnifiedRules: typeof convertScanResultsToUnifiedRules;
    getUnifiedResults: ConvertScanResultsToUnifiedResultsDelegate;
    getCards: typeof getCardViewData;
};

export class AxeResultsReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly deps: AxeResultsReportDeps,
        private readonly parameters: AccessibilityInsightsReport.AxeReportParameters,
        private readonly toolInfo: ToolData,
    ) { }

    public asHTML(): string {
        const { resultDecorator, getUnifiedRules, getUnifiedResults, getCards, reportHtmlGenerator } = this.deps;
        const { results, description, scanContext: { pageTitle } } = this.parameters;

        const scanDate = new Date(results.timestamp);

        const scanResults = resultDecorator.decorateResults(results);

        const unifiedRules = getUnifiedRules(scanResults);

        const unifiedResults = getUnifiedResults(scanResults);

        const cardSelectionViewData: CardSelectionViewData = {
            selectedResultUids: [],
            expandedRuleIds: [],
            visualHelperEnabled: false,
            resultsHighlightStatus: {},
        };

        const cardsViewModel = getCards(unifiedRules, unifiedResults, cardSelectionViewData);

        const targetAppInfo = {
            name: pageTitle,
            url: results.url,
        };

        const scanMetadata: ScanMetadata = {
            targetAppInfo: targetAppInfo,
            toolData: this.toolInfo,
            timestamp: null,
        };

        const html = reportHtmlGenerator.generateHtml(
            scanDate,
            description,
            cardsViewModel,
            scanMetadata,
        );

        return html;
    }
}
