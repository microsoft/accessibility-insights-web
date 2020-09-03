// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {  ToolData } from 'common/types/store-data/unified-data-interface';
import AccessibilityInsightsReport from './accessibilityInsightsReport';

export class SummaryResultsReport implements AccessibilityInsightsReport.Report {
    constructor(
        private readonly parameters: AccessibilityInsightsReport.SummaryReportParameters,
        private readonly toolInfo: ToolData,
    ) { }

    public asHTML(): string {
        return '<div>The Report!</div>';
    }
}
