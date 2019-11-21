// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from "axe-core";
import { ReportHtmlGenerator } from "../report-html-generator";

export class Report {
    constructor(
        private readonly results: axe.AxeResults,
        private readonly reportHtmlGenerator: ReportHtmlGenerator
    ) { }

    public asHTML(): string {
        return "<div>Report coming soon!</div>"
    }
}

