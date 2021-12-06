// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import { AssessmentReportHtmlGenerator } from 'reports/assessment-report-html-generator';
import {
    FastPassReportHtmlGenerator,
    FastPassReportModel,
} from 'reports/fast-pass-report-html-generator';
import { ReportGenerator } from 'reports/report-generator';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';

describe('ReportGenerator', () => {
    const title = 'title';
    const url = 'http://url/';
    const description = 'description';
    const cardsViewDataStub = {
        cards: exampleUnifiedStatusResults,
        visualHelperEnabled: true,
        allCardsCollapsed: true,
    };
    const tabStopRequirementStateStub = {} as TabStopRequirementState;
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
    const fastPassReportModelStub: FastPassReportModel = {
        description,
        results: {
            automatedChecks: cardsViewDataStub,
            tabStops: tabStopRequirementStateStub,
        },
        scanMetadata: scanMetadataStub,
    };

    let fastPassReportHtmlGeneratorMock: IMock<FastPassReportHtmlGenerator>;
    let automatedChecksReportHtmlGeneratorMock: IMock<ReportHtmlGenerator>;
    let assessmentReportHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;
    let assessmentJsonExportGeneratorMock: IMock<AssessmentJsonExportGenerator>;

    let testSubject: ReportGenerator;

    beforeEach(() => {
        automatedChecksReportHtmlGeneratorMock = Mock.ofType<ReportHtmlGenerator>(
            undefined,
            MockBehavior.Strict,
        );
        fastPassReportHtmlGeneratorMock = Mock.ofType<FastPassReportHtmlGenerator>(
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
                .setup(m => m.generateHtml(fastPassReportModelStub))
                .returns(() => 'stub FastPass report');

            const actual = testSubject.generateFastPassHtmlReport(
                fastPassReportModelStub,
                featureFlagStoreData,
            );

            expect(actual).toEqual('stub FastPass report');
        });

        it('uses automatedChecksReportHtmlGenerator without FeatureFlags.newTabStopsDetailsView', () => {
            const featureFlagStoreData = { [FeatureFlags.newTabStopsDetailsView]: false };

            automatedChecksReportHtmlGeneratorMock
                .setup(m => m.generateHtml(description, cardsViewDataStub, scanMetadataStub))
                .returns(() => 'stub automated checks report');

            const actual = testSubject.generateFastPassHtmlReport(
                fastPassReportModelStub,
                featureFlagStoreData,
            );

            expect(actual).toEqual('stub automated checks report');
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
});
