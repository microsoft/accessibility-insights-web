// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { reporterFactory } from 'reports/package/reporter-factory';
import { scanIssues } from 'tests/unit/tests/reports/package/scans/scan-issues';
import { scanNoIssues } from 'tests/unit/tests/reports/package/scans/scan-no-issues';

describe('report package integration', () => {
    const options = {
        browserVersion: 'BROWSER_VERSION',
        browserSpec: 'BROWSER_SPEC',
        pageTitle: 'PAGE_TITLE',
        description: 'DESCRIPTION',
    };

    // Removing script block to address issues with istanbul code coverage
    // constructs interfering with snapshot determinism.
    const rexScriptBlock = /\<script\>.*\<\/script\>/ms;

    const scans = [
        { scan: scanIssues, name: 'with issues' },
        { scan: scanNoIssues, name: 'with no issues' },
    ];

    scans.forEach(({ scan, name }) => it(name, () => {
        const reporter = reporterFactory();
        const html = reporter.fromAxeResult(scan as AxeResults, options).asHTML().replace(rexScriptBlock, '');
        expect(html).toMatchSnapshot();
    }));
});
