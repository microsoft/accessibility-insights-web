// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Report } from "reports/library/report";

describe('Report', () => {

    it('constructs', () => {
        const report = new Report(null, null);

        expect(report).toBeInstanceOf(Report);
    })

    it('returns HTML', () => {
        const report = new Report(null, null);

        const html = report.asHTML();
        expect(html).toMatchSnapshot();
    })

});
