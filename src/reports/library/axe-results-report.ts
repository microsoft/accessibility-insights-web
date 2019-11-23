// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import axe from 'axe-core';
import { ResultDecorator } from 'scanner/result-decorator';
import { ReportHtmlGenerator } from '../report-html-generator';
import { Report } from './report';

export class AxeResultReport implements Report {
    constructor(
        private readonly results: axe.AxeResults,
        private readonly reportHtmlGenerator: ReportHtmlGenerator,
        private readonly resultDecorator: ResultDecorator,
    ) {}

    public asHTML(): string {
        const scanResults = this.resultDecorator.decorateResults(this.results);

        const scanDate = new Date(this.results.timestamp);
        const html = this.reportHtmlGenerator.generateHtml(scanResults, scanDate, 'PAGE TITLE', this.results.url, 'DESCRIPTION', null);

        return html;
    }
}
