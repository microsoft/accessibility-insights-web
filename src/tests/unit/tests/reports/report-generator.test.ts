// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import { AssessmentReportHtmlGenerator } from 'reports/assessment-report-html-generator';
import { ReportGenerator } from 'reports/report-generator';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ReportNameGenerator } from 'reports/report-name-generator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';

describe('ReportGenerator', () => {
    const date = new Date(2018, 2, 12, 15, 46);
    const title = 'title';
    const url = 'http://url/';
    const fileExtension = '.html';
    const description = 'description';
    const cardsViewDataStub = {
        cards: exampleUnifiedStatusResults,
        visualHelperEnabled: true,
        allCardsCollapsed: true,
    };
    const toolDataStub: ToolData = {
        applicationProperties: { name: 'some app' },
    } as ToolData;
    const targetAppInfo = {
        name: title,
        url: url,
    };
    const scanMetadataStub: ScanMetadata = {
        toolData: toolDataStub,
        targetAppInfo: targetAppInfo,
    } as ScanMetadata;
    const featureFlagStoreDataStub: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;

    let fastPassReportHtmlGeneratorMock: IMock<ReportHtmlGenerator>;
    let automatedChecksReportHtmlGeneratorMock: IMock<ReportHtmlGenerator>;
    let nameBuilderMock: IMock<ReportNameGenerator>;
    let assessmentReportHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;
    let assessmentJsonExportGeneratorMock: IMock<AssessmentJsonExportGenerator>;

    let testSubject: ReportGenerator;

    beforeEach(() => {
        nameBuilderMock = Mock.ofType<ReportNameGenerator>(undefined, MockBehavior.Strict);
        automatedChecksReportHtmlGeneratorMock = Mock.ofType<ReportHtmlGenerator>(
            undefined,
            MockBehavior.Strict,
        );
        fastPassReportHtmlGeneratorMock = Mock.ofType<ReportHtmlGenerator>(
            undefined,
            MockBehavior.Strict,
        );
        assessmentReportHtmlGeneratorMock = Mock.ofType(
            AssessmentReportHtmlGenerator,
            MockBehavior.Strict,
        );
        assessmentJsonExportGeneratorMock = Mock.ofType(
            AssessmentJsonExportGenerator,
            MockBehavior.Strict,
        );

        testSubject = new ReportGenerator(
            nameBuilderMock.object,
            automatedChecksReportHtmlGeneratorMock.object,
            fastPassReportHtmlGeneratorMock.object,
            assessmentReportHtmlGeneratorMock.object,
            assessmentJsonExportGeneratorMock.object,
        );
    });

    describe('generateFastPassHtmlReport', () => {
        it('uses fastPassReportHtmlGenerator with FeatureFlags.newTabStopsDetailsView', () => {
            const featureFlagStoreData = { [FeatureFlags.newTabStopsDetailsView]: true };

            fastPassReportHtmlGeneratorMock
                .setup(builder =>
                    builder.generateHtml(description, cardsViewDataStub, scanMetadataStub),
                )
                .returns(() => 'returned-data');

            const actual = testSubject.generateFastPassHtmlReport(
                cardsViewDataStub,
                description,
                scanMetadataStub,
                featureFlagStoreData,
            );

            expect(actual).toMatchSnapshot();
        });
        it('uses automatedChecksReportHtmlGenerator without FeatureFlags.newTabStopsDetailsView', () => {
            const featureFlagStoreData = { [FeatureFlags.newTabStopsDetailsView]: false };

            automatedChecksReportHtmlGeneratorMock
                .setup(builder =>
                    builder.generateHtml(description, cardsViewDataStub, scanMetadataStub),
                )
                .returns(() => 'returned-data');

            const actual = testSubject.generateFastPassHtmlReport(
                cardsViewDataStub,
                description,
                scanMetadataStub,
                featureFlagStoreData,
            );

            expect(actual).toMatchSnapshot();
        });
    });

    test('generateAssessmentHtmlReport', () => {
        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const assessmentsProvider: AssessmentsProvider = { stub: 'assessmentsProvider' } as any;
        const assessmentDescription = 'generateAssessmentHtml-description';

        assessmentReportHtmlGeneratorMock
            .setup(builder =>
                builder.generateHtml(
                    assessmentStoreData,
                    assessmentsProvider,
                    featureFlagStoreDataStub,
                    targetAppInfo,
                    assessmentDescription,
                ),
            )
            .returns(() => 'generated-assessment-html')
            .verifiable(Times.once());

        const actual = testSubject.generateAssessmentHtmlReport(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreDataStub,
            targetAppInfo,
            assessmentDescription,
        );

        const expected = 'generated-assessment-html';
        expect(actual).toEqual(expected);
    });

    test('generateName', () => {
        nameBuilderMock
            .setup(builder =>
                builder.generateName(
                    'InsightsScan',
                    It.isValue(date),
                    It.isValue(title),
                    It.isValue(fileExtension),
                ),
            )
            .returns(() => 'returned-name')
            .verifiable(Times.once());

        const actual = testSubject.generateName('InsightsScan', date, title, fileExtension);

        const expected = 'returned-name';
        expect(actual).toEqual(expected);
    });
});
