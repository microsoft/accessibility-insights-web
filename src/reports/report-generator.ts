// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, TargetAppData } from 'common/types/store-data/unified-data-interface';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import {
    FastPassReportHtmlGenerator,
    FastPassReportModel,
} from 'reports/fast-pass-report-html-generator';
import { AssessmentReportHtmlGenerator } from './assessment-report-html-generator';
import { ReportHtmlGenerator } from './report-html-generator';

export class ReportGenerator {
    constructor(
        private automatedChecksReportHtmlGenerator: ReportHtmlGenerator,
        private fastPassReportHtmlGenerator: FastPassReportHtmlGenerator,
        private assessmentReportHtmlGenerator: AssessmentReportHtmlGenerator,
        private assessmentJsonExportGenerator: AssessmentJsonExportGenerator,
    ) {}

    public generateFastPassHtmlReport(
        model: FastPassReportModel,
        scanMetadata: ScanMetadata,
        featureFlagStoreData: FeatureFlagStoreData,
    ): string {
        if (featureFlagStoreData[FeatureFlags.newTabStopsDetailsView]) {
            return this.fastPassReportHtmlGenerator.generateHtml(model);
        } else {
            return this.automatedChecksReportHtmlGenerator.generateHtml(
                model.description,
                model.results.automatedChecks,
                scanMetadata,
            );
        }
    }

    public generateAssessmentHtmlReport(
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
