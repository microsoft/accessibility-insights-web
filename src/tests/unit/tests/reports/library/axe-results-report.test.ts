// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import AccessibilityInsightsReport from 'reports/library/accessibilityInsightsReport';
import { AxeResultReport } from 'reports/library/axe-results-report';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ScanResults } from 'scanner/iruleresults';
import { ResultDecorator } from 'scanner/result-decorator';
import { Mock, MockBehavior } from 'typemoq';

describe('AxeResultReport', () => {
    const expectedHTML = '<div>The Report!</div>';
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

    const mockReportHtmlGenerator = Mock.ofType<ReportHtmlGenerator>(null, MockBehavior.Strict);
    mockReportHtmlGenerator
        .setup(gen => gen.generateHtml(mockScanResults.object, reportDateTime, pageTitle, url, description, null as CardsViewModel))
        .returns(() => expectedHTML);

    it('returns HTML', () => {
        const report = new AxeResultReport(axeResults, reportOptions, mockReportHtmlGenerator.object, mockResultDecorator.object);

        const html = report.asHTML();

        mockResultDecorator.verifyAll();
        mockReportHtmlGenerator.verifyAll();

        expect(html).toMatchSnapshot();
    });
});
