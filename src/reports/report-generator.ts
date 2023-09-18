// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import {
    FastPassReportHtmlGenerator,
    FastPassReportModel,
} from 'reports/fast-pass-report-html-generator';
import { AssessmentReportHtmlGenerator } from './assessment-report-html-generator';

export class ReportGenerator {
    constructor(
        private fastPassReportHtmlGenerator: FastPassReportHtmlGenerator,
        private assessmentReportHtmlGenerator: AssessmentReportHtmlGenerator,
        private assessmentJsonExportGenerator: AssessmentJsonExportGenerator,
    ) {}

    public generateFastPassHtmlReport(model: FastPassReportModel): string {
        return this.fastPassReportHtmlGenerator.generateHtml(model);
    }

    public generateAssessmentHtmlReport(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        targetAppInfo: TargetAppData,
        description: string,
        title: string,
        bodyHeader: JSX.Element,
    ): string {
        return this.assessmentReportHtmlGenerator.generateHtml(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            targetAppInfo,
            description,
            title,
            bodyHeader,
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
