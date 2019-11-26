// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeReportRequest } from 'reports/package/accessibilityInsightsReport';
import { AxeResultsReport } from 'reports/package/axe-results-report';
import { AxeResultsReportGenerator, Reporter } from 'reports/package/reporter';
import { Mock } from 'typemoq';

describe('Reporter', () => {
    const mockRequest = Mock.ofType<AxeReportRequest>();
    const mockReport = Mock.ofType<AxeResultsReport>();
    const mockGenerator = Mock.ofType<AxeResultsReportGenerator>();
    mockGenerator
        .setup(gen => gen(mockRequest.object))
        .returns(() => mockReport.object);

    it('returns an AxeResultsReport', () => {
        const reporter = new Reporter(mockGenerator.object);

        const report = reporter.fromAxeResult(mockRequest.object);
        expect(report).toBe(mockReport.object);
    });
});
