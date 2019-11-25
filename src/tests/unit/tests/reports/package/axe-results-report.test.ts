// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { convertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import AccessibilityInsightsReport from 'reports/package/accessibilityInsightsReport';
import { AxeResultReport, AxeResultReportDeps } from 'reports/package/axe-results-report';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ScanResults } from 'scanner/iruleresults';
import { ResultDecorator } from 'scanner/result-decorator';
import { Mock, MockBehavior } from 'typemoq';

describe('AxeResultReport', () => {
    const reportDateTime = new Date(2019, 10, 23, 15, 35, 0);
    const url = 'https://the.page';
    const pageTitle = 'PAGE_TITLE';
    const description = 'DESCRIPTION';

    const reportOptions: AccessibilityInsightsReport.ReportOptions = {
        browserSpec: 'BROWSER_SPEC',
        browserVersion: 'BROWSER_VERSION',
        pageTitle,
        description,
    };

    const axeResults = {
        timestamp: reportDateTime.toISOString(),
        url,
    } as AxeResults;

    const mockScanResults = Mock.ofType<ScanResults>();

    const mockResultDecorator = Mock.ofType<ResultDecorator>(null, MockBehavior.Strict);
    mockResultDecorator.setup(dec => dec.decorateResults(axeResults)).returns(() => mockScanResults.object);

    const mockRules = Mock.ofType<UnifiedRule[]>();
    const mockGetRules = Mock.ofType<typeof convertScanResultsToUnifiedRules>(null, MockBehavior.Strict);
    mockGetRules.setup(fn => fn(mockScanResults.object)).returns(() => mockRules.object);

    const mockResults = Mock.ofType<UnifiedResult[]>();
    const mockGetResults = Mock.ofType<typeof convertScanResultsToUnifiedResults>(null, MockBehavior.Strict);
    mockGetResults.setup(fn => fn(mockScanResults.object, generateUID)).returns(() => mockResults.object);

    const emptyCardSelectionViewData = {
        highlightedResultUids: [],
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
    };
    const mockCardsViewModel = Mock.ofType<CardsViewModel>();
    const mockGetCards = Mock.ofType<typeof getCardViewData>(null, MockBehavior.Strict);
    mockGetCards.setup(fn => fn(mockRules.object, mockResults.object, emptyCardSelectionViewData)).returns(() => mockCardsViewModel.object);

    const expectedHTML = '<div>The Report!</div>';
    const mockReportHtmlGenerator = Mock.ofType<ReportHtmlGenerator>(null, MockBehavior.Strict);
    mockReportHtmlGenerator
        .setup(gen => gen.generateHtml(mockScanResults.object, reportDateTime, pageTitle, url, description, mockCardsViewModel.object))
        .returns(() => expectedHTML);

    const deps: AxeResultReportDeps = {
        reportHtmlGenerator: mockReportHtmlGenerator.object,
        resultDecorator: mockResultDecorator.object,
        getRules: mockGetRules.object,
        getResults: mockGetResults.object,
        getCards: mockGetCards.object,
        getUUID: generateUID,
    };

    it('returns HTML', () => {
        const report = new AxeResultReport(axeResults, reportOptions, deps);

        const html = report.asHTML();

        expect(html).toEqual(expectedHTML);
    });
});
