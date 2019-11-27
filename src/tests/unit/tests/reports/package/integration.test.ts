// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { reporterFactory } from 'reports/package/reporter-factory';
import { formatHtmlForSnapshot } from 'tests/end-to-end/common/element-snapshot-formatter';
import { scanIssues } from 'tests/unit/tests/reports/package/scans/scan-issues';
import { scanNoIssues } from 'tests/unit/tests/reports/package/scans/scan-no-issues';

describe('report package integration', () => {
    const scanContext = {
        browserVersion: 'BROWSER_VERSION',
        browserSpec: 'BROWSER_SPEC',
        pageTitle: 'PAGE_TITLE',
    };
    const description = 'DESCRIPTION';


    // Removing script block to address issues with istanbul code coverage
    // constructs interfering with snapshot determinism.
    const rexScriptBlock = /\<script\>.*\<\/script\>/ms;

    const scans = [
        { scan: scanIssues, name: 'with issues' },
        { scan: scanNoIssues, name: 'with no issues' },
    ];

    scans.forEach(({ scan, name }) => it(name, () => {
        const reporter = reporterFactory();
        const parameters = {
            results: scan as AxeResults,
            description,
            scanContext,
        };
        const html = formatHtmlForSnapshot(reporter.fromAxeResult(parameters).asHTML().replace(rexScriptBlock, ''));
        expect(html).toMatchSnapshot();
    }));
});
