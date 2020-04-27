// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
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

    let dataBuilderMock: IMock<ReportHtmlGenerator>;
    let nameBuilderMock: IMock<ReportNameGenerator>;
    let assessmentReportHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;

    beforeEach(() => {
        nameBuilderMock = Mock.ofType<ReportNameGenerator>(undefined, MockBehavior.Strict);
        dataBuilderMock = Mock.ofType<ReportHtmlGenerator>(undefined, MockBehavior.Strict);
        assessmentReportHtmlGeneratorMock = Mock.ofType(
            AssessmentReportHtmlGenerator,
            MockBehavior.Strict,
        );
    });

    test('generateHtml', () => {
        dataBuilderMock
            .setup(builder =>
                builder.generateHtml(date, description, cardsViewDataStub, scanMetadataStub),
            )
            .returns(() => 'returned-data');

        const testObject = new ReportGenerator(
            nameBuilderMock.object,
            dataBuilderMock.object,
            assessmentReportHtmlGeneratorMock.object,
        );
        const actual = testObject.generateFastPassAutomatedChecksReport(
            date,
            cardsViewDataStub,
            description,
            scanMetadataStub,
        );

        expect(actual).toMatchSnapshot();
    });

    test('generateAssessmentHtml', () => {
        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const assessmentsProvider: AssessmentsProvider = { stub: 'assessmentsProvider' } as any;
        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;
        const assessmentDescription = 'generateAssessmentHtml-description';

        assessmentReportHtmlGeneratorMock
            .setup(builder =>
                builder.generateHtml(
                    assessmentStoreData,
                    assessmentsProvider,
                    featureFlagStoreData,
                    targetAppInfo,
                    assessmentDescription,
                ),
            )
            .returns(() => 'generated-assessment-html')
            .verifiable(Times.once());

        const testObject = new ReportGenerator(
            nameBuilderMock.object,
            dataBuilderMock.object,
            assessmentReportHtmlGeneratorMock.object,
        );
        const actual = testObject.generateAssessmentReport(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            targetAppInfo,
            assessmentDescription,
        );

        const expected = 'generated-assessment-html';
        expect(actual).toEqual(expected);
    });

    test('generateName', () => {
        nameBuilderMock
            .setup(builder =>
                builder.generateName('InsightsScan', It.isValue(date), It.isValue(title)),
            )
            .returns(() => 'returned-name')
            .verifiable(Times.once());

        const testObject = new ReportGenerator(
            nameBuilderMock.object,
            dataBuilderMock.object,
            assessmentReportHtmlGeneratorMock.object,
        );
        const actual = testObject.generateName('InsightsScan', date, title);

        const expected = 'returned-name';
        expect(actual).toEqual(expected);
    });
});
