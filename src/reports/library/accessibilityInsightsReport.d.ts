declare namespace AccessibilityInsightsReport {
    export type Report = {
        asHTML(): string;
    };

    export type ReportOptions = {
        browserVersion: string;
        browserSpec: string;
        pageTitle: string;
        description: string;
    };

    export type Reporter = {
        fromAxeResult: (results: axe.AxeResults, options: AccessibilityInsightsReport.ReportOptions) => Report;
    };

    export type ReporterFactory = () => Reporter;

    export const reporterFactory: ReporterFactory;
}

export = AccessibilityInsightsReport;
