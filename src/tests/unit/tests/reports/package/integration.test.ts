// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { ScanSummaryDetails, SummaryReportParameters, SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import { reporterFactory } from 'reports/package/reporter-factory';
import { formatHtmlForSnapshot } from 'tests/common/element-snapshot-formatter';
import { summaryScanWithIssues } from './example-input/summary-scan-with-issues';
import { summaryScanWithoutIssues } from './example-input/summary-scan-without-issues';
import { axeResultsWithIssues } from './example-input/axe-results-with-issues';
import { axeResultsWithoutIssues } from './example-input/axe-results-without-issues';

describe('report package API', () => {
    const scanContext = {
        pageTitle: 'PAGE_TITLE',
    };
    const description = 'DESCRIPTION';
    const serviceName = 'Accessibility Insights Service';

    describe('fromAxeResult', () => {
        it.each`
            name                | scan
            ${'with issues'}    | ${axeResultsWithIssues}
            ${'without issues'} | ${axeResultsWithoutIssues}
        `('matches snapshot for scan input $name', ({scan}) => {
            const reporter = reporterFactory();
            const parameters = {
                results: scan as AxeResults,
                description,
                serviceName,
                scanContext,
            };
            const html = formatHtmlForSnapshot(reporter.fromAxeResult(parameters).asHTML());
            expect(html).toMatchSnapshot();
        });
    });

    describe('fromSummaryResults', () => {
        it.each`
            name                | scanParameters
            ${'with issues'}    | ${summaryScanWithIssues}
            ${'without issues'} | ${summaryScanWithoutIssues}
        `('matches snapshot for scan input $name', ({scanParameters}) => {
            const reporter = reporterFactory();
            const html = formatHtmlForSnapshot(reporter.fromSummaryResults(scanParameters).asHTML());
            expect(html).toMatchSnapshot();
        });
    });
});
