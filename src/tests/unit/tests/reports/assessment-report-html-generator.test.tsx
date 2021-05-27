// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import {
    AssessmentReportHtmlGenerator,
    AssessmentReportHtmlGeneratorDeps,
} from 'reports/assessment-report-html-generator';
import { ReportModel } from 'reports/assessment-report-model';
import { AssessmentReportModelBuilder } from 'reports/assessment-report-model-builder';
import { AssessmentReportModelBuilderFactory } from 'reports/assessment-report-model-builder-factory';
import * as reportStyles from 'reports/assessment-report.styles';
import { AssessmentReport } from 'reports/components/assessment-report';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { It, Mock, MockBehavior } from 'typemoq';

import * as detailsViewBundledCSS from '../../../../DetailsView/bundled-details-view-styles';
import { CreateTestAssessmentProviderWithFeatureFlag } from '../../common/test-assessment-provider';

describe('AssessmentReportHtmlGenerator', () => {
    test('generateHtml', () => {
        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        const factoryMock = Mock.ofType(AssessmentReportModelBuilderFactory, MockBehavior.Strict);
        const dateGetterMock = Mock.ofInstance<() => Date>(() => {
            return null;
        }, MockBehavior.Strict);

        const assessmentsProvider = CreateTestAssessmentProviderWithFeatureFlag();
        const assessmentStoreData: AssessmentStoreData = { stub: 'assessmentStoreData' } as any;
        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;
        const targetAppInfo: TargetAppData = { stub: 'targetAppInfo' } as any;
        const description = 'generateHtml-description';

        const deps: AssessmentReportHtmlGeneratorDeps = {
            outcomeTypeSemanticsFromTestStatus: {
                stub: 'outcomeTypeSemanticsFromTestStatus',
            } as any,
        } as AssessmentReportHtmlGeneratorDeps;

        const modelBuilderMock = Mock.ofType(AssessmentReportModelBuilder, MockBehavior.Strict);
        const model: ReportModel = { stub: 'model' } as any;

        // tslint:disable: react-no-dangerous-html
        const expectedComponent = (
            <React.Fragment>
                <head>
                    <meta charSet="UTF-8" />
                    <title>Assessment report</title>
                    <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
                    <style dangerouslySetInnerHTML={{ __html: detailsViewBundledCSS.styleSheet }} />
                </head>
                <body>
                    <AssessmentReport
                        deps={deps}
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

        modelBuilderMock.setup(mb => mb.getReportModelData()).returns(() => model);

        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(expectedComponent)))
            .returns(() => expectedBody);

        const testSubject = new AssessmentReportHtmlGenerator(
            deps,
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
            targetAppInfo,
            description,
        );

        expect(actualHtml).toEqual(expectedHtml);

        rendererMock.verifyAll();
        factoryMock.verifyAll();
        dateGetterMock.verifyAll();
        modelBuilderMock.verifyAll();
    });
});
