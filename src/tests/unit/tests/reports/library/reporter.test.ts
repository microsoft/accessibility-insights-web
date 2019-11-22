// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from "axe-core";
import { AxeResultReport as AxeResultsReport } from "reports/library/axe-results-report";
import { AxeResultsReportGenerator, Reporter } from "reports/library/reporter";
import { Mock } from "typemoq";

describe('Reporter', () => {

    const mockAxeResults = Mock.ofType<axe.AxeResults>();
    const mockAxeResultsReport = Mock.ofType<AxeResultsReport>();
    const mockAxeResultsReportGenerator = Mock.ofType<AxeResultsReportGenerator>();
    mockAxeResultsReportGenerator.setup(gen => gen(mockAxeResults.object)).returns(() => mockAxeResultsReport.object)

    it('returns an AxeResultsReport', () => {
        const reporter = new Reporter(mockAxeResultsReportGenerator.object);

        const report = reporter.fromAxeResult(mockAxeResults.object);
        expect(report).toBe(mockAxeResultsReport.object);
    })

});
