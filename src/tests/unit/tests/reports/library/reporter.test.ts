// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Reporter } from "reports/library/reporter";
import { Report } from "reports/library/report";

describe('ReportGenerator', () => {

    it('constructs', () => {
        const reporter = new Reporter();

        expect(reporter).toBeInstanceOf(Reporter);
    })

    it('returns a report', () => {
        const reporter = new Reporter();

        const report = reporter.generateReport(null);
        expect(report).toBeInstanceOf(Report);
    })

});
