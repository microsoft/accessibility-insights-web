// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { DateProvider } from '../../../../../common/date-provider';
import { EnvironmentInfo } from '../../../../../common/environment-info-provider';
import { ReportHeadV2 } from '../../../../../DetailsView/reports/components/report-head-v2';
import { ReportBody, ReportBodyProps } from '../../../../../DetailsView/reports/components/report-sections/report-body';
import { ReportSectionFactory } from '../../../../../DetailsView/reports/components/report-sections/report-section-factory';
import { ReactStaticRenderer } from '../../../../../DetailsView/reports/react-static-renderer';
import { ReportHtmlGeneratorV2 } from '../../../../../DetailsView/reports/report-html-generator-v2';
import { ScanResults } from '../../../../../scanner/iruleresults';

describe('ReportHtmlGeneratorV2', () => {
    test('generateHtml', () => {
        const browserSpec: string = 'browser-spect';
        const extensionVersion: string = 'extension-version';
        const axeCoreVersion: string = 'axe-version';
        const scanResult: ScanResults = {} as any;
        const scanDate: Date = new Date(2018, 2, 12, 16, 24);
        const pageTitle: string = 'page-title';
        const pageUrl: string = 'https://page-url/';
        const description: string = 'description';

        const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = anyDate => '2018-03-12 11:24 PM UTC';

        const sectionFactoryMock = Mock.ofType<ReportSectionFactory>();
        const environmentInfo: EnvironmentInfo = {
            axeCoreVersion,
            browserSpec,
            extensionVersion,
        };
        const sectionProps: ReportBodyProps = {
            sectionFactory: sectionFactoryMock.object,
            pageTitle,
            pageUrl,
            description,
            scanDate,
            scanResult,
            environmentInfo,
            utcDateConverter: getUTCStringFromDateStub,
        };

        const headElement: JSX.Element = <ReportHeadV2 />;
        const bodyElement: JSX.Element = <ReportBody {...sectionProps} />;

        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(headElement)))
            .returns(() => '<head-markup />')
            .verifiable(Times.once());
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(bodyElement)))
            .returns(() => '<body-markup />')
            .verifiable(Times.once());

        const testObject = new ReportHtmlGeneratorV2(
            sectionFactoryMock.object,
            rendererMock.object,
            environmentInfo,
            getUTCStringFromDateStub,
        );

        const actual = testObject.generateHtml(scanResult, scanDate, pageTitle, pageUrl, description);

        expect(actual).toMatchSnapshot();
    });
});
