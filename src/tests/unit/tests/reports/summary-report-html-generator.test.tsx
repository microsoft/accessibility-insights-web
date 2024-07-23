// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NullComponent } from 'common/components/null-component';
import { DateProvider } from 'common/date-provider';
import {
    ScanMetadata,
    ScanTimespan,
    ToolData,
} from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { ReportBody, ReportBodyProps } from 'reports/components/report-sections/report-body';
import { ReportCollapsibleContainerControl } from 'reports/components/report-sections/report-collapsible-container';
import { ReportSectionFactory } from 'reports/components/report-sections/report-section-factory';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { SummaryScanResults } from 'reports/package/accessibilityInsightsReport';
import { ReactStaticRenderer } from 'reports/react-static-renderer';
import { SummaryReportHtmlGenerator } from 'reports/summary-report-html-generator';
import { It, Mock, MockBehavior, Times } from 'typemoq';

describe('ReportHtmlGenerator', () => {
    test('generateHtml', () => {
        const pageTitle: string = 'page-title';
        const baseUrl: string = 'https://page-url/';

        const getUTCStringFromDateStub: typeof DateProvider.getUTCStringFromDate = () => '';
        const getTimeStringFromSecondsStub: typeof DateProvider.getTimeStringFromSeconds = () => '';

        const sectionFactoryMock = Mock.ofType<ReportSectionFactory<SummaryReportSectionProps>>();

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

        const getScriptMock = Mock.ofInstance(() => '');

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

        const deps = {
            collapsibleControl: ReportCollapsibleContainerControl,
        };

        const results: SummaryScanResults = {
            failed: [
                {
                    url: `${baseUrl}/failed`,
                    numFailures: 1,
                    reportLocation: 'failed report link',
                },
            ],
            passed: [
                {
                    url: `${baseUrl}/passed`,
                    numFailures: 0,
                    reportLocation: 'passed report link',
                },
            ],
            unscannable: [
                {
                    url: `${baseUrl}/error`,
                    errorType: 'error name',
                    errorDescription: 'error description',
                    errorLogLocation: 'error log file',
                },
            ],
        };

        const sectionProps: ReportBodyProps<SummaryReportSectionProps> = {
            deps,
            sectionFactory: sectionFactoryMock.object,
            toUtcString: getUTCStringFromDateStub,
            secondsToTimeString: getTimeStringFromSecondsStub,
            getCollapsibleScript: getScriptMock.object,
            scanMetadata,
            results,
        };

        const headElement: JSX.Element = <NullComponent />;
        const bodyElement: JSX.Element = <ReportBody {...sectionProps} />;

        const rendererMock = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        sectionFactoryMock.setup(mock => mock.HeadSection).returns(() => NullComponent);
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(headElement)))
            .returns(() => '<head-markup />')
            .verifiable(Times.once());
        rendererMock
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(bodyElement)))
            .returns(() => '<body-markup />')
            .verifiable(Times.once());

        const testObject = new SummaryReportHtmlGenerator(
            sectionFactoryMock.object,
            rendererMock.object,
            getScriptMock.object,
            getUTCStringFromDateStub,
            getTimeStringFromSecondsStub,
        );

        const actual = testObject.generateHtml(scanMetadata, results);

        expect(actual).toMatchSnapshot();
    });
});
