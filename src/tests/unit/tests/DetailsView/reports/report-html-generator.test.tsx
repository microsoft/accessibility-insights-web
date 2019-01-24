// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { ReportBody } from '../../../../../DetailsView/reports/components/report-body';
import { ReportHead } from '../../../../../DetailsView/reports/components/report-head';
import { ReactStaticRenderer } from '../../../../../DetailsView/reports/react-static-renderer';
import { ReportHtmlGenerator } from '../../../../../DetailsView/reports/report-html-generator';
import { ScanResults } from '../../../../../scanner/iruleresults';

describe('ReportHtmlGeneratorTest', () => {
    test('generateHtml', () => {
        const userAgent: string = 'user-agent';
        const version: string = 'version';
        const axeVersion: string = 'axe-version';
        const scanResult: ScanResults = {} as any;
        const scanDate: Date = new Date(2018, 2, 12, 16, 24);
        const pageTitle: string = 'page-title';
        const pageUrl: string = 'https://page-url/';
        const description: string = 'description';

        const headElement: JSX.Element = <ReportHead />;
        const bodyElement: JSX.Element =
            <ReportBody
                scanResult={scanResult}
                pageTitle={pageTitle}
                pageUrl={pageUrl}
                description={description}
                scanDate={scanDate}
                browserSpec={userAgent}
                extensionVersion={version}
                axeVersion={axeVersion}
            />;

        const renderer = Mock.ofType(ReactStaticRenderer, MockBehavior.Strict);
        renderer
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(headElement)))
            .returns(() => '<head-markup />')
            .verifiable(Times.once());
        renderer
            .setup(r => r.renderToStaticMarkup(It.isObjectWith(bodyElement)))
            .returns(() => '<body-markup />')
            .verifiable(Times.once());

        const testObject = new ReportHtmlGenerator(
            renderer.object,
            userAgent,
            version,
            axeVersion,
        );
        const actual = testObject.generateHtml(scanResult, scanDate, pageTitle, pageUrl, description);

        const expected = '<html lang="en"><head-markup /><body-markup /></html>';
        expect(actual).toEqual(expected);
        renderer.verifyAll();
    });
});
