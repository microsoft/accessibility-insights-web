// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AxeReportParameters,
    CombinedReportParameters,
    SummaryReportParameters
} from 'reports/package/accessibilityInsightsReport';
import { AxeResultsReport } from 'reports/package/axe-results-report';
import {
    AxeResultsReportGenerator,
    Reporter,
    SummaryResultsReportGenerator
} from 'reports/package/reporter';
import { Mock, IMock } from 'typemoq';
import { SummaryResultsReport } from 'reports/package/summary-results-report';

describe('Reporter', () => {
    let mockReport: IMock<AxeResultsReport>;
    let mockSummaryReport: IMock<SummaryResultsReport>;
    let mockGenerator: IMock<AxeResultsReportGenerator>;
    let mockSummaryGenerator: IMock<SummaryResultsReportGenerator>;
    
    const axeReportParameters = {} as AxeReportParameters;
    const summaryReportParameters = {} as SummaryReportParameters;
    const combinedReportParameters = {} as CombinedReportParameters;

    let reporter: Reporter;

    beforeEach(() => {
        mockReport = Mock.ofType<AxeResultsReport>();
        mockSummaryReport = Mock.ofType<SummaryResultsReport>();
        mockGenerator = Mock.ofType<AxeResultsReportGenerator>();
        mockSummaryGenerator = Mock.ofType<SummaryResultsReportGenerator>();
        mockGenerator
            .setup(gen => gen(axeReportParameters))
            .returns(() => mockReport.object);
        mockSummaryGenerator
            .setup(gen => gen(summaryReportParameters))
            .returns(() => mockSummaryReport.object);
        
        reporter = new Reporter(mockGenerator.object, mockSummaryGenerator.object);
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
        expect(report).toBeNull();
    });
});
