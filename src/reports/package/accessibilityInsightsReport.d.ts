// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import axe from 'axe-core';

declare namespace AccessibilityInsightsReport {
    export type Report = {
        asHTML(): string;
    };

    export type ScanContext = {
        browserVersion: string;
        browserSpec: string;
        pageTitle: string;
    };

    export type AxeReportParameters = {
        results: axe.AxeResults,
        description: string;
        scanContext: ScanContext;
    }

    export type Reporter = {
        fromAxeResult: (parameters: AxeReportParameters) => Report;
    };

    export type ReporterFactory = () => Reporter;

    export const reporterFactory: ReporterFactory;
}

export = AccessibilityInsightsReport;
