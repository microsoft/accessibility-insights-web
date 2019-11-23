// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { AxeResultReport } from 'reports/library/axe-results-report';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ResultDecorator } from 'scanner/result-decorator';
import { Mock } from 'typemoq';
import { ScanResults } from 'scanner/iruleresults';
import { CardsViewModel } from 'common/types/store-data/card-view-model';

describe('AxeResultReport', () => {
    const expectedHTML = '<div>The Report!</div>';
    const mockAxeResults = Mock.ofType<axe.AxeResults>();
    const mockScanResults = Mock.ofType<ScanResults>();
    const mockResultDecorator = Mock.ofType<ResultDecorator>();
    mockResultDecorator.setup(dec => dec.decorateResults(mockAxeResults.object)).returns(() => mockScanResults.object);
    const mockReportHtmlGenerator = Mock.ofType<ReportHtmlGenerator>();
    mockReportHtmlGenerator
        .setup(gen => gen.generateHtml(mockScanResults.object, new Date(), 'PAGE TITLE', 'PAGE URL', 'DESCRIPTION', null as CardsViewModel))
        .returns(() => expectedHTML);

    it('returns HTML', () => {
        const report = new AxeResultReport(null, mockReportHtmlGenerator.object, mockResultDecorator.object);

        const html = report.asHTML();
        expect(html).toMatchSnapshot();
    });
});
