// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { CardSelectionViewData } from 'common/get-card-selection-view-data';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ToolData, UnifiedResult, UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { ConvertScanResultsToUnifiedResultsDelegate } from 'injected/adapters/scan-results-to-unified-results';
import { convertScanResultsToUnifiedRules } from 'injected/adapters/scan-results-to-unified-rules';
import { AxeReportParameters, SummaryReportParameters, CrawlSummaryDetails, SummaryScanResult, SummaryScanError } from 'reports/package/accessibilityInsightsReport';
import { AxeResultsReport, AxeResultsReportDeps } from 'reports/package/axe-results-report';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ScanResults } from 'scanner/iruleresults';
import { ResultDecorator } from 'scanner/result-decorator';
import { Mock, MockBehavior } from 'typemoq';
import { SummaryResultsReport } from 'reports/package/summary-results-report';

describe('SummaryResultsReport', () => {
    const baseUrl = 'https://the.page';
    const toolDataStub: ToolData = {
        applicationProperties: { name: 'some app' },
    } as ToolData;

    const crawlDetails: CrawlSummaryDetails = {
        baseUrl: baseUrl,
        scanStart: new Date(2019, 1, 2, 3),
        scanComplete: new Date(2019, 4, 5, 6),
        durationSeconds: 42,
    };

    const failedScanResults: SummaryScanResult[] = [
        {
            url: `${baseUrl}/failed`,
            numFailures: 1,
            reportLocation: 'failed report link',
        }
    ];
    const passedScanResults: SummaryScanResult[] = [
        {
            url: `${baseUrl}/passed`,
            numFailures: 0,
            reportLocation: 'passed report link',
        }
    ];
    const scanErrors: SummaryScanError[] = [
        {
            url: `${baseUrl}/error`,
            errorType: 'error name',
            errorDescription: 'error description',
        }
    ];

    const parameters: SummaryReportParameters = {
        serviceName: 'service name',
        axeVersion: 'axe version',
        userAgent: 'browser spec',
        crawlDetails,
        results: {
            failed: failedScanResults,
            passed: passedScanResults,
            unscannable: scanErrors,
        }
    };

    const expectedHTML = '<div>The Report!</div>';

    it('returns HTML', () => {
        const report = new SummaryResultsReport(parameters, toolDataStub);

        const html = report.asHTML();

        expect(html).toEqual(expectedHTML);
    });
});
