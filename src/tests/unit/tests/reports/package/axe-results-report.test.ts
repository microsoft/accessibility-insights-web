// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ToolData, UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { ConvertScanResultsToUnifiedResultsDelegate } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { AxeReportParameters } from 'reports/package/accessibilityInsightsReport';
import { AxeResultsReport, AxeResultsReportDeps } from 'reports/package/axe-results-report';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ScanResults } from 'scanner/iruleresults';
import { ResultDecorator } from 'scanner/result-decorator';
import { It, Mock, MockBehavior } from 'typemoq';

describe('AxeResultReport', () => {
    const scanTimestamp = 'timestamp';
    const reportDateTime = new Date(2019, 10, 23, 15, 35, 0);
    const url = 'https://the.page';
    const pageTitle = 'PAGE_TITLE';
    const description = 'DESCRIPTION';
    const toolDataStub: ToolData = {
        applicationProperties: { name: 'some app' },
    } as ToolData;
    const targetAppInfoStub = {
        name: pageTitle,
        url: url,
    };
    const scanMetadataStub = {
        toolData: toolDataStub,
        targetAppInfo: targetAppInfoStub,
        timespan: {
            scanComplete: reportDateTime,
        }
    };

    const results = {
        timestamp: scanTimestamp,
        url,
    } as AxeResults;

    const parameters: AxeReportParameters = {
        results,
        description,
        serviceName: 'THE_SERVICE',
        scanContext: {
            pageTitle,
        },
    };

    const mockScanResults = Mock.ofType<ScanResults>();

    const mockResultDecorator = Mock.ofType<ResultDecorator>(null, MockBehavior.Strict);
    mockResultDecorator.setup(dec => dec.decorateResults(results)).returns(() => mockScanResults.object);

    const mockRules = Mock.ofType<UnifiedRule[]>();
    const mockGetRules = Mock.ofType<typeof convertScanResultsToUnifiedRules>(null, MockBehavior.Strict);
    mockGetRules.setup(fn => fn(mockScanResults.object)).returns(() => mockRules.object);

    const mockResults = Mock.ofType<UnifiedResult[]>();
    const mockGetResults = Mock.ofType<ConvertScanResultsToUnifiedResultsDelegate>(null, MockBehavior.Strict);
    mockGetResults.setup(fn => fn(mockScanResults.object)).returns(() => mockResults.object);

    const emptyCardSelectionViewData: CardSelectionViewData = {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };
    const mockCardsViewModel = Mock.ofType<CardsViewModel>();
    const mockGetCards = Mock.ofType<typeof getCardViewData>(null, MockBehavior.Strict);
    mockGetCards.setup(fn => fn(It.isAny(), emptyCardSelectionViewData, mockRules.object)).returns(() => mockCardsViewModel.object);
    
    const expectedHTML = '<div>The Report!</div>';
    const mockReportHtmlGenerator = Mock.ofType<ReportHtmlGenerator>(null, MockBehavior.Strict);
    mockReportHtmlGenerator
        .setup(gen => gen.generateHtml(description, mockCardsViewModel.object, scanMetadataStub))
        .returns(() => expectedHTML);

    const mockGetDateFromTimestamp = Mock.ofType<(timestamp: string) => Date>();
    mockGetDateFromTimestamp.setup(md => md(scanTimestamp)).returns(() => reportDateTime);

    const deps: AxeResultsReportDeps = {
        reportHtmlGenerator: mockReportHtmlGenerator.object,
        resultDecorator: mockResultDecorator.object,
        getUnifiedRules: mockGetRules.object,
        getUnifiedResults: mockGetResults.object,
        getCards: mockGetCards.object,
        getDateFromTimestamp: mockGetDateFromTimestamp.object,
    };

    it('returns HTML', () => {
        const report = new AxeResultsReport(deps, parameters, toolDataStub);

        const html = report.asHTML();

        expect(html).toEqual(expectedHTML);
    });
});
