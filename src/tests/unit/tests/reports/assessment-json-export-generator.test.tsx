// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import { ReportModel } from 'reports/assessment-report-model';
import { AssessmentReportModelBuilder } from 'reports/assessment-report-model-builder';
import { AssessmentReportModelBuilderFactory } from 'reports/assessment-report-model-builder-factory';
import { It, Mock, MockBehavior } from 'typemoq';
import { CreateTestAssessmentProviderWithFeatureFlag } from '../../common/test-assessment-provider';

describe('AssessmentJsonExportGenerator', () => {
    test('generateJSON', () => {
        const factoryMock = Mock.ofType(AssessmentReportModelBuilderFactory, MockBehavior.Strict);
        const dateGetterMock = Mock.ofInstance<() => Date>(() => {
            return null;
        }, MockBehavior.Strict);

        const assessmentsProvider = CreateTestAssessmentProviderWithFeatureFlag();
        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;
        const targetAppInfo: TargetAppData = { stub: 'targetAppInfo' } as any;
        const description = 'generateJson-description';
        const testDate = new Date(2018, 9, 19, 11, 25);

        const modelBuilderMock = Mock.ofType(AssessmentReportModelBuilder, MockBehavior.Strict);
        const modelStub: ReportModel = {
            scanDetails: {
                url: 'testUrl',
                targetPage: 'testTitle',
                reportDate: testDate,
            },
            passedDetailsData: [],
            incompleteDetailsData: [],
            failedDetailsData: [],
        } as any;

        const assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator =
            new AssessmentDefaultMessageGenerator();

        dateGetterMock.setup(dg => dg()).returns(() => testDate);

        factoryMock
            .setup(f =>
                f.create(
                    It.isAny(),
                    assessmentStoreData,
                    targetAppInfo,
                    testDate,
                    assessmentDefaultMessageGenerator,
                ),
            )
            .returns(() => modelBuilderMock.object);

        modelBuilderMock.setup(mb => mb.getReportModelData()).returns(() => modelStub);

        const testSubject = new AssessmentJsonExportGenerator(
            factoryMock.object,
            dateGetterMock.object,
            'extensionVersion',
            assessmentDefaultMessageGenerator,
        );

        const actualJson = testSubject.generateJson(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            targetAppInfo,
            description,
        );

        expect(actualJson).toEqual(
            '{"url":"testUrl","title":"testTitle","date":"2018-10-19T18:25:00.000Z","comment":"generateJson-description","version":"extensionVersion","results":[]}',
        );

        factoryMock.verifyAll();
        dateGetterMock.verifyAll();
        modelBuilderMock.verifyAll();
    });
});
