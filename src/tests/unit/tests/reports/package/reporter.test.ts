// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AxeReportParameters,
    CombinedReportParameters,
    SummaryReportParameters
} from 'reports/package/accessibilityInsightsReport';
import { AxeResultsReport } from 'reports/package/axe-results-report';
import { CombinedResultsReport } from 'reports/package/combined-results-report';
import {
    AxeResultsReportGenerator,
    CombinedReportGenerator,
    Reporter,
    SummaryResultsReportGenerator
} from 'reports/package/reporter';
import { SummaryResultsReport } from 'reports/package/summary-results-report';
import { Mock, IMock } from 'typemoq';

describe('Reporter', () => {
    let mockReport: IMock<AxeResultsReport>;
    let mockSummaryReport: IMock<SummaryResultsReport>;
    let mockCombinedReport: IMock<CombinedResultsReport>;
    let mockGenerator: IMock<AxeResultsReportGenerator>;
    let mockSummaryGenerator: IMock<SummaryResultsReportGenerator>;
    let mockCombinedReportGenerator: IMock<CombinedReportGenerator>;
    
    const axeReportParameters = {
        reportType: 'axe report',
    } as unknown as AxeReportParameters;
    const summaryReportParameters = {
        reportType: 'summary report'
    } as unknown as SummaryReportParameters;
    const combinedReportParameters = {
        reportType: 'combined report'
    } as unknown as CombinedReportParameters;

    let reporter: Reporter;

    beforeEach(() => {
        mockReport = Mock.ofType<AxeResultsReport>();
        mockSummaryReport = Mock.ofType<SummaryResultsReport>();
        mockCombinedReport = Mock.ofType<CombinedResultsReport>();
        mockGenerator = Mock.ofType<AxeResultsReportGenerator>();
        mockSummaryGenerator = Mock.ofType<SummaryResultsReportGenerator>();
        mockCombinedReportGenerator = Mock.ofType<CombinedReportGenerator>();
        mockGenerator
            .setup(gen => gen(axeReportParameters))
            .returns(() => mockReport.object);
        mockSummaryGenerator
            .setup(gen => gen(summaryReportParameters))
            .returns(() => mockSummaryReport.object);
        mockCombinedReportGenerator
            .setup(gen => gen(combinedReportParameters))
            .returns(() => mockCombinedReport.object);
        
        reporter = new Reporter(
            mockGenerator.object,
            mockSummaryGenerator.object,
            mockCombinedReportGenerator.object
        );
    });

    it('returns an AxeResultsReport', () => {
        const report = reporter.fromAxeResult(axeReportParameters);
        expect(report).toBe(mockReport.object);
    });

    it('returns a SummaryResultsReport', () => {
        const report = reporter.fromSummaryResults(summaryReportParameters);
        expect(report).toBe(mockSummaryReport.object);
    });

    it('returns a CombinedResultsReport', () => {
        const report = reporter.fromCombinedResults(combinedReportParameters);
        expect(report).toBe(mockCombinedReport.object);
    });
});
