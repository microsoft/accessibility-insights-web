// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { AssessmentReportHtmlGenerator } from 'reports/assessment-report-html-generator';
import { ReportGenerator } from 'reports/report-generator';
import { ReportHtmlGenerator } from 'reports/report-html-generator';
import { ReportNameGenerator } from 'reports/report-name-generator';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('ReportGenerator', () => {
    const scanResult: ScanResults = {} as any;
    const date = new Date(2018, 2, 12, 15, 46);
    const title = 'title';
    const url = 'http://url/';
    const description = 'description';

    let dataBuilderMock: IMock<ReportHtmlGenerator>;
    let nameBuilderMock: IMock<ReportNameGenerator>;
    let assessmentReportHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;

    beforeEach(() => {
        nameBuilderMock = Mock.ofType<ReportNameGenerator>(undefined, MockBehavior.Strict);
        dataBuilderMock = Mock.ofType<ReportHtmlGenerator>(undefined, MockBehavior.Strict);
        assessmentReportHtmlGeneratorMock = Mock.ofType(AssessmentReportHtmlGenerator, MockBehavior.Strict);
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
            .returns(() => 'returned-data');

        const testObject = new ReportGenerator(nameBuilderMock.object, dataBuilderMock.object, assessmentReportHtmlGeneratorMock.object);
        const actual = testObject.generateFastPassAutomateChecksReport(scanResult, date, title, url, description);

        expect(actual).toMatchSnapshot();
    });

    test('generateAssessmentHtml', () => {
        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const assessmentsProvider: AssessmentsProvider = { stub: 'assessmentsProvider' } as any;
        const tabStoreData: TabStoreData = { stub: 'tabStoreData' } as any;
        const assessmentDescription = 'generateAssessmentHtml-description';

        assessmentReportHtmlGeneratorMock
            .setup(builder => builder.generateHtml(assessmentStoreData, assessmentsProvider, tabStoreData, assessmentDescription))
            .returns(() => 'generated-assessment-html')
            .verifiable(Times.once());

        const testObject = new ReportGenerator(nameBuilderMock.object, dataBuilderMock.object, assessmentReportHtmlGeneratorMock.object);
        const actual = testObject.generateAssessmentReport(assessmentStoreData, assessmentsProvider, tabStoreData, assessmentDescription);

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
