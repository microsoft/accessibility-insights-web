// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import axe from 'axe-core';
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { UUIDGenerator } from 'common/uid-generator';
import { convertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { ResultDecorator } from 'scanner/result-decorator';
import { ReportHtmlGenerator } from '../report-html-generator';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

export type AxeResultReportDeps = {
    reportHtmlGenerator: ReportHtmlGenerator;
    resultDecorator: ResultDecorator;
    getRules: typeof convertScanResultsToUnifiedRules;
    getResults: typeof convertScanResultsToUnifiedResults;
    getCards: typeof getCardViewData;
    getUUID: UUIDGenerator;
};

export class AxeResultReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly axeResults: axe.AxeResults,
        private readonly options: AccessibilityInsightsReport.ReportOptions,
        private readonly deps: AxeResultReportDeps,
    ) {}

    public asHTML(): string {
        const { resultDecorator, getRules, getResults, getCards, getUUID, reportHtmlGenerator } = this.deps;

        const scanDate = new Date(this.axeResults.timestamp);

        const scanResults = resultDecorator.decorateResults(this.axeResults);

        const rules = getRules(scanResults);

        const results = getResults(scanResults, getUUID);

        const cardSelectionViewData: CardSelectionViewData = {
            highlightedResultUids: [],
            selectedResultUids: [],
            expandedRuleIds: [],
            visualHelperEnabled: false,
        };

        const cardsViewModel = getCards(rules, results, cardSelectionViewData);

        const html = reportHtmlGenerator.generateHtml(
            scanDate,
            this.options.pageTitle,
            this.axeResults.url,
            this.options.description,
            cardsViewModel,
        );

        return html;
    }
}
