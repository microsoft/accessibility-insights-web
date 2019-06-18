// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';
import { AssessmentReportHtmlGenerator } from '../../../../../DetailsView/reports/assessment-report-html-generator';
import { createReportGeneratorProvider, ReportGeneratorProvider } from '../../../../../DetailsView/reports/report-generator-provider';
import { ReportGeneratorV2 } from '../../../../../DetailsView/reports/report-generator-v2';
import { ReportHtmlGenerator } from '../../../../../DetailsView/reports/report-html-generator';
import { ReportNameGenerator } from '../../../../../DetailsView/reports/report-name-generator';

describe('ReportGeneratorProvider', () => {
    let nameGeneratorMock: IMock<ReportNameGenerator>;
    let htmlGeneratorMock: IMock<ReportHtmlGenerator>;
    let assessmentHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;
    let provider: ReportGeneratorProvider;

    beforeEach(() => {
        nameGeneratorMock = Mock.ofType<ReportNameGenerator>();
        htmlGeneratorMock = Mock.ofType<ReportHtmlGenerator>();
        assessmentHtmlGeneratorMock = Mock.ofType<AssessmentReportHtmlGenerator>();
        provider = createReportGeneratorProvider(nameGeneratorMock.object, htmlGeneratorMock.object, assessmentHtmlGeneratorMock.object);
    });

    it('creates report generator, feature flag off', () => {
        const generator = provider.getGenerator();

        expect(generator).toBeInstanceOf(ReportGeneratorV2);
    });
});
