// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { convertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { ResultDecorator } from 'scanner/result-decorator';

import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
import { ReportHtmlGenerator } from '../report-html-generator';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

export type AxeResultsReportDeps = {
    reportHtmlGenerator: ReportHtmlGenerator;
    resultDecorator: ResultDecorator;
    getUnifiedRules: typeof convertScanResultsToUnifiedRules;
    getUnifiedResults: typeof convertScanResultsToUnifiedResults;
    getCards: typeof getCardViewData;
    getUUID: UUIDGenerator;
};

export class AxeResultsReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly deps: AxeResultsReportDeps,
        private readonly parameters: AccessibilityInsightsReport.AxeReportParameters,
        private readonly toolInfo: ToolData,
    ) { }

    public asHTML(): string {
        const { resultDecorator, getUnifiedRules, getUnifiedResults, getCards, getUUID, reportHtmlGenerator } = this.deps;
        const { results, description, scanContext: { pageTitle } } = this.parameters;

        const scanDate = new Date(results.timestamp);

        const scanResults = resultDecorator.decorateResults(results);

        const unifiedRules = getUnifiedRules(scanResults);

        const unifiedResults = getUnifiedResults(scanResults, getUUID);

        const cardSelectionViewData: CardSelectionViewData = {
            highlightedResultUids: [],
            selectedResultUids: [],
            expandedRuleIds: [],
            visualHelperEnabled: false,
        };

        const cardsViewModel = getCards(unifiedRules, unifiedResults, cardSelectionViewData);

        const targetAppInfo = {
            name: pageTitle,
            url: results.url,
        };

        const scanMetadata: ScanMetaData = {
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
