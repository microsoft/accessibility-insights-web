// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NullComponent } from 'common/components/null-component';
import { DateProvider } from 'common/date-provider';
import { ScanMetadata, ScanTimespan, ToolData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { CombinedReportHtmlGenerator } from 'reports/combined-report-html-generator';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { ReportSectionFactory } from 'reports/components/report-sections/report-section-factory';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { IMock, It, Mock, Times } from 'typemoq';

describe('CombinedReportHtmlGenerator', () => {
    let testSubject: CombinedReportHtmlGenerator;

    const pageTitle: string = 'page-title';
    const baseUrl: string = 'https://page-url/';

    const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = () => '';
    const getTimeStringFromSecondsStub: typeof DateProvider.getTimeStringFromSeconds = () => '';

    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };

    const targetAppInfo = {
        name: pageTitle,
        url: baseUrl,
    };

    const scanTimespan: ScanTimespan = {
        scanStart: new Date(2020, 1, 2, 3),
        scanComplete: new Date(2020, 4, 5, 6),
        durationSeconds: 42,
    };

    const scanMetadata = {
        toolData: toolData,
        targetAppInfo: targetAppInfo,
        timespan: scanTimespan,
    } as ScanMetadata;

    let getScriptMock: IMock<() => string>;
    let sectionFactoryMock: IMock<ReportSectionFactory<CombinedReportSectionProps>>;
    let rendererMock: IMock<ReactStaticRenderer>;

    beforeEach(() => {
        getScriptMock = Mock.ofInstance(() => '');
        sectionFactoryMock = Mock.ofType<ReportSectionFactory<CombinedReportSectionProps>>();
        rendererMock = Mock.ofType<ReactStaticRenderer>();

        testSubject = new CombinedReportHtmlGenerator(
            sectionFactoryMock.object,
            rendererMock.object,
            getScriptMock.object,
            getUTCStringFromDateStub,
            getTimeStringFromSecondsStub,
        );
    });

    it('generateHtml', () => {
        const sectionProps: ReportBodyProps<CombinedReportSectionProps> = {
            sectionFactory: sectionFactoryMock.object,
            toUtcString: getUTCStringFromDateStub,
            secondsToTimeString: getTimeStringFromSecondsStub,
            getCollapsibleScript: getScriptMock.object,
            scanMetadata,
        };

        const headElement: JSX.Element = <NullComponent />;
        const bodyElement: JSX.Element = <ReportBody {...sectionProps} />;

        sectionFactoryMock.setup(mock => mock.HeadSection).returns(() => NullComponent);
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(headElement)))
            .returns(() => '<head-markup />')
            .verifiable(Times.once());
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(bodyElement)))
            .returns(() => '<body-markup />')
            .verifiable(Times.once());

        const html = testSubject.generateHtml(scanMetadata);

        expect(html).toMatchSnapshot();
    });
});
