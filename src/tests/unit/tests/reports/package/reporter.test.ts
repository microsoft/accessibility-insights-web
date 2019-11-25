// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import AccessibilityInsightsReport from 'reports/package/accessibilityInsightsReport';
import { AxeResultReport as AxeResultsReport } from 'reports/package/axe-results-report';
import { AxeResultsReportGenerator, Reporter } from 'reports/package/reporter';
import { Mock } from 'typemoq';

describe('Reporter', () => {
    const mockAxeResults = Mock.ofType<axe.AxeResults>();
    const mockReportOptions = Mock.ofType<AccessibilityInsightsReport.ReportOptions>();
    const mockAxeResultsReport = Mock.ofType<AxeResultsReport>();
    const mockAxeResultsReportGenerator = Mock.ofType<AxeResultsReportGenerator>();
    mockAxeResultsReportGenerator
        .setup(gen => gen(mockAxeResults.object, mockReportOptions.object))
        .returns(() => mockAxeResultsReport.object);

    it('returns an AxeResultsReport', () => {
        const reporter = new Reporter(mockAxeResultsReportGenerator.object);

        const report = reporter.fromAxeResult(mockAxeResults.object, mockReportOptions.object);
        expect(report).toBe(mockAxeResultsReport.object);
    });
});
