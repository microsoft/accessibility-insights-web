// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ToolData } from "common/types/store-data/unified-data-interface";
import { CombinedReportHtmlGenerator } from "reports/combined-report-html-generator";
import { CombinedReportParameters, CombinedReportResults, ScanSummaryDetails } from "reports/package/accessibilityInsightsReport";
import { CombinedResultsReport } from "reports/package/combined-results-report";
import { IMock, It, Mock } from "typemoq";

describe('CombinedResultsReport', () => {
    let reportHtmlGeneratorMock: IMock<CombinedReportHtmlGenerator>;

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

    const results = {} as CombinedReportResults;

    const parameters: CombinedReportParameters = {
        serviceName: 'service name',
        axeVersion: 'axe version',
        userAgent: 'browser spec',
        scanDetails: scanDetails,
        results,
    };

    const expectedHtml = '<div>The Report!</div>';

    beforeEach(() => {
        reportHtmlGeneratorMock = Mock.ofType(CombinedReportHtmlGenerator);

        const deps = {
            reportHtmlGenerator: reportHtmlGeneratorMock.object,
        }
        combinedResultsReport = new CombinedResultsReport(deps, parameters, toolDataStub);
    });

    it('returns HTML', () => {
        reportHtmlGeneratorMock.setup(rhg => rhg.generateHtml(scanMetadataStub)).returns(() => expectedHtml);

        const html = combinedResultsReport.asHTML();

        expect(html).toEqual(expectedHtml);
    })
})
