// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ScanResults } from '../../scanner/iruleresults';
import { ReportBody } from './components/report-body';
import { ReportHead } from './components/report-head';
import { ReactStaticRenderer } from './react-static-renderer';

export class ReportHtmlGeneratorV1 {
    constructor(
        private reactStaticRenderer: ReactStaticRenderer,
        private browserSpec: string,
        private extensionVersion: string,
        private axeVersion: string,
    ) {}

    public generateHtml(scanResult: ScanResults, scanDate: Date, pageTitle: string, pageUrl: string, description: string): string {
        const headElement: JSX.Element = <ReportHead />;
        const headMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(headElement);

        const bodyElement: JSX.Element = (
            <ReportBody
                scanResult={scanResult}
                pageTitle={pageTitle}
                pageUrl={pageUrl}
                description={description}
                scanDate={scanDate}
                browserSpec={this.browserSpec}
                extensionVersion={this.extensionVersion}
                axeVersion={this.axeVersion}
            />
        );
        const bodyMarkup: string = this.reactStaticRenderer.renderToStaticMarkup(bodyElement);

        return '<html lang="en">' + headMarkup + bodyMarkup + '</html>';
    }
}
