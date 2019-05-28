// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { ScanResults } from '../../scanner/iruleresults';

export interface ReportGenerator {
    generateName(baseName: string, scanDate: Date, pageTitle: string): string;
    generateHtml(scanResult: ScanResults, scanData: Date, pageTitle: string, pageUrl: string, description: string): string;
    generateAssessmentHtml(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        tabStoreData: TabStoreData,
        description: string,
    ): string;
}
