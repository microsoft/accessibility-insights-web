// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from "axe-core";
import { Report } from "./report";
import { reportHtmlGeneratorInitializer as defaultReportHtmlGeneratorInitializer } from "./report-html-generator-initializer";

export class Reporter {
    constructor(
        private readonly reportHtmlGeneratorInitializer = defaultReportHtmlGeneratorInitializer) { }

    public generateReport(results: axe.AxeResults): Report {
        return new Report(results, this.reportHtmlGeneratorInitializer());
    }
}
