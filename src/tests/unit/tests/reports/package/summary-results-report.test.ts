// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { SummaryReportParameters, CrawlSummaryDetails, SummaryScanResult, SummaryScanError, SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import { SummaryResultsReport } from 'reports/package/summary-results-report';
import { SummaryReportHtmlGenerator } from 'reports/summary-report-html-generator';
import { Mock } from 'typemoq';

describe('SummaryResultsReport', () => {
    const baseUrl = 'https://the.page';
    const toolDataStub: ToolData = {
        applicationProperties: { name: 'some app' },
    } as ToolData;
    const targetAppInfoStub = {
        name: null,
        url: baseUrl,
    };
    const scanMetadataStub = {
        toolData: toolDataStub,
        targetAppInfo: targetAppInfoStub,
        timestamp: null,
    };

    const crawlDetails: CrawlSummaryDetails = {
        baseUrl: baseUrl,
        scanStart: new Date(2019, 1, 2, 3),
        scanComplete: new Date(2019, 4, 5, 6),
        durationSeconds: 42,
    };

    const results: SummaryScanResults  = {
        failed: [
            {
                url: `${baseUrl}/failed`,
                numFailures: 1,
                reportLocation: 'failed report link',
            }
        ],
        passed: [
            {
                url: `${baseUrl}/passed`,
                numFailures: 0,
                reportLocation: 'passed report link',
            }
        ],
        unscannable: [
            {
                url: `${baseUrl}/error`,
                errorType: 'error name',
                errorDescription: 'error description',
            }
        ]
    };

    const parameters: SummaryReportParameters = {
        serviceName: 'service name',
        axeVersion: 'axe version',
        userAgent: 'browser spec',
        crawlDetails,
        results,
    };

    const expectedHTML = '<div>The Report!</div>';

    const mockHtmlGenerator = Mock.ofType<SummaryReportHtmlGenerator>();
    mockHtmlGenerator
        .setup(hg => hg.generateHtml(crawlDetails, scanMetadataStub, results))
        .returns(() => expectedHTML);

    const deps = {
        reportHtmlGenerator: mockHtmlGenerator.object,
    }

    it('returns HTML', () => {
        const report = new SummaryResultsReport(deps, parameters, toolDataStub);

        const html = report.asHTML();

        expect(html).toEqual(expectedHTML);
    });
});
