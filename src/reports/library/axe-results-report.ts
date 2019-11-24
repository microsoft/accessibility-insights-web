// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import axe from 'axe-core';
import { ResultDecorator } from 'scanner/result-decorator';
import { ReportHtmlGenerator } from '../report-html-generator';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

export class AxeResultReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly results: axe.AxeResults,
        private readonly options: AccessibilityInsightsReport.ReportOptions,
        private readonly reportHtmlGenerator: ReportHtmlGenerator,
        private readonly resultDecorator: ResultDecorator,
    ) {}

    public asHTML(): string {
        const scanDate = new Date(this.results.timestamp);

        const scanResults = this.resultDecorator.decorateResults(this.results);

        const cardsViewModel = null; // working on getting this!

        const html = this.reportHtmlGenerator.generateHtml(
            scanResults,
            scanDate,
            this.options.pageTitle,
            this.results.url,
            this.options.description,
            cardsViewModel,
        );

        return html;
    }
}
