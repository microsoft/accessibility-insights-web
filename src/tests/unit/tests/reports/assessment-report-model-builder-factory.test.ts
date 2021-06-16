// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { AssessmentReportModelBuilderFactory } from 'reports/assessment-report-model-builder-factory';

describe('AssessmentReportModelBuilderFactory', () => {
    test('create', () => {
        const testSubject = new AssessmentReportModelBuilderFactory();

        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const assessmentsProvider: AssessmentsProvider = { stub: 'assessmentsProvider' } as any;
        const targetAppInfo: TargetAppData = { stub: 'targetAppInfo' } as any;
        const reportDate = new Date(2018, 9, 19, 10, 53);
        const assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator =
            new AssessmentDefaultMessageGenerator();

        const actual = testSubject.create(
            assessmentsProvider,
            assessmentStoreData,
            targetAppInfo,
            reportDate,
            assessmentDefaultMessageGenerator,
        );

        expect((actual as any).assessmentStoreData).toBe(assessmentStoreData);
        expect((actual as any).assessmentsProvider).toBe(assessmentsProvider);
        expect((actual as any).targetAppInfo).toBe(targetAppInfo);
        expect((actual as any).reportDate).toBe(reportDate);
    });
});
