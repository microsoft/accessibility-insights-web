// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import {
    AssessmentJsonExportSuccessCriterion,
    buildAssessmentJsonExportData,
} from 'reports/assessment-json-export-json-builder';
import { ReportModel } from 'reports/assessment-report-model';
import { AssessmentReportModelBuilder } from 'reports/assessment-report-model-builder';
import { AssessmentReportModelBuilderFactory } from 'reports/assessment-report-model-builder-factory';

export interface AssessmentJsonExport {
    url: string;
    title: string;
    date: string;
    comment: string;
    version: string;
    results: AssessmentJsonExportSuccessCriterion[];
}
export class AssessmentJsonExportGenerator {
    constructor(
        private assessmentReportModelBuilderFactory: AssessmentReportModelBuilderFactory,
        private dateGetter: () => Date,
        private extensionVersion: string,
        private assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator,
    ) {}

    public generateJson(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        targetAppInfo: TargetAppData,
        description: string,
    ): string {
        const filteredProvider = assessmentsProviderWithFeaturesEnabled(
            assessmentsProvider,
            featureFlagStoreData,
        );

        const modelBuilder: AssessmentReportModelBuilder =
            this.assessmentReportModelBuilderFactory.create(
                filteredProvider,
                assessmentStoreData,
                targetAppInfo,
                this.dateGetter(),
                this.assessmentDefaultMessageGenerator,
            );

        const model: ReportModel = modelBuilder.getReportModelData();

        const reportData: AssessmentJsonExport = buildAssessmentJsonExportData(
            description,
            this.extensionVersion,
            model,
        );

        return JSON.stringify(reportData);
    }
}
