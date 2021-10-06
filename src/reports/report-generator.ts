// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, TargetAppData } from 'common/types/store-data/unified-data-interface';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import { AssessmentReportHtmlGenerator } from './assessment-report-html-generator';
import { ReportHtmlGenerator } from './report-html-generator';
import { ReportNameGenerator } from './report-name-generator';

export class ReportGenerator {
    constructor(
        private reportNameGenerator: ReportNameGenerator,
        private reportHtmlGenerator: ReportHtmlGenerator,
        private assessmentReportHtmlGenerator: AssessmentReportHtmlGenerator,
        private assessmentJsonExportGenerator: AssessmentJsonExportGenerator,
    ) {}

    public generateName(
        baseName: string,
        scanDate: Date,
        pageTitle: string,
        fileExtension: string,
    ): string {
        return this.reportNameGenerator.generateName(baseName, scanDate, pageTitle, fileExtension);
    }

    public generateFastPassAutomatedChecksReport(
        cardsViewData: CardsViewModel,
        description: string,
        scanMetadata: ScanMetadata,
    ): string {
        return this.reportHtmlGenerator.generateHtml(description, cardsViewData, scanMetadata);
    }

    public generateAssessmentHTMLReport(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        targetAppInfo: TargetAppData,
        description: string,
    ): string {
        return this.assessmentReportHtmlGenerator.generateHtml(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            targetAppInfo,
            description,
        );
    }

    public generateAssessmentJsonExport(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        targetAppInfo: TargetAppData,
        description: string,
    ): string {
        return this.assessmentJsonExportGenerator.generateJson(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            targetAppInfo,
            description,
        );
    }
}
