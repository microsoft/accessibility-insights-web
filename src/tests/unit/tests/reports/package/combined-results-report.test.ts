// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CombinedReportHtmlGenerator } from "reports/combined-report-html-generator";
import { CombinedResultsReport } from "reports/package/combined-results-report";
import { IMock, It, Mock } from "typemoq";

describe('CombinedResultsReport', () => {
    const expectedHtml = '';

    let reportHtmlGeneratorMock: IMock<CombinedReportHtmlGenerator>;

    let combinedResultsReport: CombinedResultsReport;

    beforeEach(() => {
        reportHtmlGeneratorMock = Mock.ofType(CombinedReportHtmlGenerator);

        const deps = {
            reportHtmlGenerator: reportHtmlGeneratorMock.object,
        }
        combinedResultsReport = new CombinedResultsReport(deps);
    });

    it('returns HTML', () => {
        reportHtmlGeneratorMock.setup(rhg => rhg.generateHtml(It.isAny(), It.isAny())).returns(() => expectedHtml);

        const html = combinedResultsReport.asHTML();

        expect(html).toEqual(expectedHtml);
    })
})
