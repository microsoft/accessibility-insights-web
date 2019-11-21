// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { reportHtmlGeneratorInitializer } from "reports/library/report-html-generator-initializer";
import { ReportHtmlGenerator } from "reports/report-html-generator";

describe('ReportHtmlGeneratorInitializer', () => {

    it('returns a valid generator', () => {
        const initalizer = reportHtmlGeneratorInitializer();

        expect(initalizer).toBeInstanceOf(ReportHtmlGenerator);
    })

});
