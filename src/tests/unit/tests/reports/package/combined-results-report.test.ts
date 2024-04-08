// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewModel } from "common/types/store-data/card-view-model";
import { ToolData } from "common/types/store-data/unified-data-interface";
import { CombinedReportHtmlGenerator } from "reports/combined-report-html-generator";
import { CombinedReportParameters, CombinedReportResults, ScanSummaryDetails } from "reports/package/accessibilityInsightsReport";
import { CombinedResultsReport } from "reports/package/combined-results-report";
import { CombinedResultsToCardsModelConverter } from "reports/package/combined-results-to-cards-model-converter";
import { IMock, Mock } from "typemoq";

describe('CombinedResultsReport', () => {
    let reportHtmlGeneratorMock: IMock<CombinedReportHtmlGenerator>;
    let resultsToCardsConverterMock: IMock<CombinedResultsToCardsModelConverter>;
    

    let combinedResultsReport: CombinedResultsReport;

    const baseUrl = 'https://the.page';
    const basePageTitle = 'page title';
    const toolDataStub: ToolData = {
        applicationProperties: { name: 'some app' },
    } as ToolData;
    const targetAppInfoStub = {
        name: basePageTitle,
        url: baseUrl,
    };
    const scanTimespanStub = {
        scanStart: new Date(2019, 1, 2, 3),
        scanComplete: new Date(2019, 4, 5, 6),
        durationSeconds: 42,
    };
    const scanMetadataStub = {
        toolData: toolDataStub,
        targetAppInfo: targetAppInfoStub,
        timespan: scanTimespanStub,
    };
    

    const scanDetails: ScanSummaryDetails = {
        baseUrl: baseUrl,
        basePageTitle: basePageTitle,
        ...scanTimespanStub
    };

    const urlResultsCount = {
        passedUrls: 1,
        failedUrls: 2,
        unscannableUrls: 3,
    };

    const results = {
        resultsByRule: {
            failed: [],
        },
        urlResults: urlResultsCount,
    } as CombinedReportResults;

    let parameters: CombinedReportParameters;
    const cardsViewDataStub: CardsViewModel = {
        visualHelperEnabled: false,
        allCardsCollapsed: true,
        cards: {
            fail: [],
            pass: [],
            inapplicable: [],
            unknown: [],
        },
    };

    const expectedHtml = '<div>The Report!</div>';

    beforeEach(() => {
        reportHtmlGeneratorMock = Mock.ofType(CombinedReportHtmlGenerator);
        resultsToCardsConverterMock = Mock.ofType<CombinedResultsToCardsModelConverter>();
        parameters = {
            serviceName: 'service name',
            axeVersion: 'axe version',
            userAgent: 'browser spec',
            browserResolution: '1920x1080',
            scanDetails: scanDetails,
            results,
        };
    

        const deps = {
            reportHtmlGenerator: reportHtmlGeneratorMock.object,
        };
        combinedResultsReport = new CombinedResultsReport(
            deps,
            parameters,
            toolDataStub,
            resultsToCardsConverterMock.object
        );
    });

    it('returns HTML', () => {
        resultsToCardsConverterMock
            .setup(rtc => rtc.convertResults(results.resultsByRule))
            .returns(() => cardsViewDataStub);

        reportHtmlGeneratorMock
            .setup(rhg => rhg.generateHtml(scanMetadataStub, cardsViewDataStub, urlResultsCount))
            .returns(() => expectedHtml);

        const html = combinedResultsReport.asHTML();

        expect(html).toEqual(expectedHtml);
    })
})
