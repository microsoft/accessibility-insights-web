// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { ScanResults } from 'scanner/iruleresults';

import { AssessmentReportHtmlGenerator } from './assessment-report-html-generator';
import { ReportHtmlGenerator } from './report-html-generator';
import { ReportNameGenerator } from './report-name-generator';

export class ReportGenerator {
    constructor(
        private reportNameGenerator: ReportNameGenerator,
        private reportHtmlGenerator: ReportHtmlGenerator,
        private assessmentReportHtmlGenerator: AssessmentReportHtmlGenerator,
    ) {}

    public generateName(baseName: string, scanDate: Date, pageTitle: string): string {
        return this.reportNameGenerator.generateName(baseName, scanDate, pageTitle);
    }

    public generateFastPassAutomateChecksReport(
        scanResult: ScanResults,
        scanDate: Date,
        pageTitle: string,
        pageUrl: string,
        description: string,
    ): string {
        return this.reportHtmlGenerator.generateHtml(scanResult, scanDate, pageTitle, pageUrl, description);
    }

    public generateAssessmentReport(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        tabStoreData: TabStoreData,
        description: string,
    ): string {
        return this.assessmentReportHtmlGenerator.generateHtml(assessmentStoreData, assessmentsProvider, tabStoreData, description);
    }
}
