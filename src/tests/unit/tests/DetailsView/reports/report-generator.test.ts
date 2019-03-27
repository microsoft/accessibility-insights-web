// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProvider } from '../../../../../assessments/types/iassessments-provider';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../../../common/types/store-data/itab-store-data';
import { AssessmentReportHtmlGenerator } from '../../../../../DetailsView/reports/assessment-report-html-generator';
import { ReportGenerator, ReportGeneratorDeps } from '../../../../../DetailsView/reports/report-generator';
import { ReportHtmlGenerator } from '../../../../../DetailsView/reports/report-html-generator';
import { ReportNameGenerator } from '../../../../../DetailsView/reports/report-name-generator';
import { ScanResults } from '../../../../../scanner/iruleresults';

describe('ReportGeneratorTest', () => {
    const scanResult: ScanResults = {} as any;
    const date = new Date(2018, 2, 12, 15, 46);
    const title = 'title';
    const url = 'http://url/';
    const description = 'description';

    let dataBuilderMock: IMock<ReportHtmlGenerator>;
    let nameBuilderMock: IMock<ReportNameGenerator>;
    let assessmentReportHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;

    const deps: ReportGeneratorDeps = {
        outcomeTypeSemanticsFromTestStatus: { stub: 'outcomeTypeSemanticsFromTestStatus' } as any,
    };

    beforeEach(() => {
        nameBuilderMock = Mock.ofType(ReportNameGenerator, MockBehavior.Strict);
        dataBuilderMock = Mock.ofType(ReportHtmlGenerator, MockBehavior.Strict);
        assessmentReportHtmlGeneratorMock = Mock.ofType(AssessmentReportHtmlGenerator, MockBehavior.Strict);
    });

    afterEach(() => {
        dataBuilderMock.verifyAll();
        nameBuilderMock.verifyAll();
    });

    test('generateHtml', () => {
        dataBuilderMock
            .setup(builder =>
                builder.generateHtml(
                    It.isObjectWith(scanResult),
                    It.isValue(date),
                    It.isValue(title),
                    It.isValue(url),
                    It.isValue(description),
                ),
            )
            .returns(() => 'returned-data')
            .verifiable(Times.once());

        const testObject = new ReportGenerator(nameBuilderMock.object, dataBuilderMock.object, assessmentReportHtmlGeneratorMock.object);
        const actual = testObject.generateHtml(scanResult, date, title, url, description);

        const expected = 'returned-data';
        expect(actual).toEqual(expected);
    });

    test('generateAssessmentHtml', () => {
        const assessmentStoreData: IAssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const assessmentsProvider: AssessmentsProvider = { stub: 'assessmentsProvider' } as any;
        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;
        const tabStoreData: ITabStoreData = { stub: 'tabStoreData' } as any;
        const assessmentDescription = 'generateAssessmentHtml-description';

        assessmentReportHtmlGeneratorMock
            .setup(builder =>
                builder.generateHtml(assessmentStoreData, assessmentsProvider, featureFlagStoreData, tabStoreData, assessmentDescription),
            )
            .returns(() => 'generated-assessment-html')
            .verifiable(Times.once());

        const testObject = new ReportGenerator(nameBuilderMock.object, dataBuilderMock.object, assessmentReportHtmlGeneratorMock.object);
        const actual = testObject.generateAssessmentHtml(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            tabStoreData,
            assessmentDescription,
        );

        const expected = 'generated-assessment-html';
        expect(actual).toEqual(expected);
    });

    test('generateName', () => {
        nameBuilderMock
            .setup(builder => builder.generateName('InsightsScan', It.isValue(date), It.isValue(title)))
            .returns(() => 'returned-name')
            .verifiable(Times.once());

        const testObject = new ReportGenerator(nameBuilderMock.object, dataBuilderMock.object, assessmentReportHtmlGeneratorMock.object);
        const actual = testObject.generateName('InsightsScan', date, title);

        const expected = 'returned-name';
        expect(actual).toEqual(expected);
    });
});
