// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import * as React from 'react';
import { AssessmentJsonExportGenerator } from 'reports/assessment-json-export-generator';
import { AssessmentReportHtmlGenerator } from 'reports/assessment-report-html-generator';
import { AssessmentReportBodyHeader } from 'reports/components/assessment-report-body-header';
import {
    FastPassReportHtmlGenerator,
    FastPassReportModel,
} from 'reports/fast-pass-report-html-generator';
import { ReportGenerator } from 'reports/report-generator';
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
    const targetPage = {
        name: title,
        url: url,
    };
    const featureFlagStoreDataStub: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;
    const fastPassReportModelStub: FastPassReportModel = {
        description,
        results: {
            automatedChecks: cardsViewDataStub,
            tabStops: tabStopRequirementStateStub,
        },
        targetPage: targetPage,
    };

    let fastPassReportHtmlGeneratorMock: IMock<FastPassReportHtmlGenerator>;
    let assessmentReportHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;
    let assessmentJsonExportGeneratorMock: IMock<AssessmentJsonExportGenerator>;

    let testSubject: ReportGenerator;

    beforeEach(() => {
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
            fastPassReportHtmlGeneratorMock.object,
            assessmentReportHtmlGeneratorMock.object,
            assessmentJsonExportGeneratorMock.object,
        );
    });

    describe('generateFastPassHtmlReport', () => {
        it('uses fastPassReportHtmlGenerator', () => {
            fastPassReportHtmlGeneratorMock
                .setup(m => m.generateHtml(fastPassReportModelStub))
                .returns(() => 'stub FastPass report');

            const actual = testSubject.generateFastPassHtmlReport(fastPassReportModelStub);

            expect(actual).toEqual('stub FastPass report');
        });
    });

    test('generateAssessmentHtmlReport', () => {
        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const assessmentsProvider: AssessmentsProvider = { stub: 'assessmentsProvider' } as any;
        const assessmentDescription = 'generateAssessmentHtml-description';
        const TITLE = 'Assessment report';
        const bodyHeader = React.createElement(AssessmentReportBodyHeader, {}, null);

        assessmentReportHtmlGeneratorMock
            .setup(builder =>
                builder.generateHtml(
                    assessmentStoreData,
                    assessmentsProvider,
                    featureFlagStoreDataStub,
                    targetPage,
                    assessmentDescription,
                    TITLE,
                    bodyHeader,
                ),
            )
            .returns(() => 'generated-assessment-html')
            .verifiable(Times.once());

        const actual = testSubject.generateAssessmentHtmlReport(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreDataStub,
            targetPage,
            assessmentDescription,
            TITLE,
            bodyHeader,
        );

        const expected = 'generated-assessment-html';
        expect(actual).toEqual(expected);
    });
});
