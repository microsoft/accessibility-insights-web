// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { It, Mock, MockBehavior } from 'typemoq';

import { AssessmentDefaultMessageGenerator } from '../../../../../assessments/assessment-default-message-generator';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../../../common/types/store-data/itab-store-data';
import { AssessmentReportHtmlGenerator } from '../../../../../DetailsView/reports/assessment-report-html-generator';
import { IReportModel } from '../../../../../DetailsView/reports/assessment-report-model';
import { AssessmentReportModelBuilder } from '../../../../../DetailsView/reports/assessment-report-model-builder';
import { AssessmentReportModelBuilderFactory } from '../../../../../DetailsView/reports/assessment-report-model-builder-factory';
import * as reportStyles from '../../../../../DetailsView/reports/assessment-report.styles';
import { AssessmentReport } from '../../../../../DetailsView/reports/components/assessment-report';
import { ReactStaticRenderer } from '../../../../../DetailsView/reports/react-static-renderer';
import { CreateTestAssessmentProviderWithFeatureFlag } from '../../../common/test-assessment-provider';

describe('AssessmentReportHtmlGenerator', () => {
    test('generateHtml', () => {
        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        const factoryMock = Mock.ofType(AssessmentReportModelBuilderFactory, MockBehavior.Strict);
        const dateGetterMock = Mock.ofInstance<() => Date>(() => { return null; }, MockBehavior.Strict);

        const assessmentsProvider = CreateTestAssessmentProviderWithFeatureFlag();
        const assessmentStoreData: IAssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;
        const tabStoreData: ITabStoreData = { stub: 'tabStoreData' } as any;
        const description = 'generateHtml-description';

        const modelBuilderMock = Mock.ofType(AssessmentReportModelBuilder, MockBehavior.Strict);
        const model: IReportModel = { stub: 'model' } as any;

        const expectedComponent = (
            <React.Fragment>
                <head>
                    <title>Assessment report</title>
                    <style dangerouslySetInnerHTML={{__html: reportStyles.styleSheet}}></style>
                </head>
                <body>
                    <AssessmentReport
                        data={model}
                        description={description}
                        extensionVersion="ProductVersion"
                        axeVersion="axeVersion"
                        chromeVersion="chromeVersion"
                    />
                </body>
            </React.Fragment>
        );
        const expectedBody: string = '<head>styles</head><body>report-body</body>';
        const expectedHtml = `<html lang="en">${expectedBody}</html>`;

        const testDate = new Date(2018, 9, 19, 11, 25);
        const assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();

        dateGetterMock
            .setup(dg => dg())
            .returns(() => testDate);

        factoryMock
            .setup(f => f.create(It.isAny(), assessmentStoreData, tabStoreData, testDate, assessmentDefaultMessageGenerator))
            .returns(() => modelBuilderMock.object);

        modelBuilderMock
            .setup(mb => mb.getReportModelData())
            .returns(() => model);

        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(expectedComponent)))
            .returns(() => expectedBody);

        const testSubject = new AssessmentReportHtmlGenerator(
            rendererMock.object,
            factoryMock.object,
            dateGetterMock.object,
            'ProductVersion',
            'axeVersion',
            'chromeVersion',
            assessmentDefaultMessageGenerator,
        );

        const actualHtml = testSubject.generateHtml(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            tabStoreData,
            description,
        );

        expect(actualHtml).toEqual(expectedHtml);

        rendererMock.verifyAll();
        factoryMock.verifyAll();
        dateGetterMock.verifyAll();
        modelBuilderMock.verifyAll();
    });
});
