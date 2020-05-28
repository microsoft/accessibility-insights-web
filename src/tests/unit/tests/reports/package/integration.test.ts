// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResults } from 'axe-core';
import { reporterFactory } from 'reports/package/reporter-factory';
import { formatHtmlForSnapshot } from 'tests/common/element-snapshot-formatter';
import { scanIssues } from 'tests/unit/tests/reports/package/scans/scan-issues';
import { scanNoIssues } from 'tests/unit/tests/reports/package/scans/scan-no-issues';

describe('report package integration', () => {
    const scanContext = {
        pageTitle: 'PAGE_TITLE',
    };
    const description = 'DESCRIPTION';
    const serviceName = 'Accessibility Insights Service';

    const scans = [
        { scan: scanIssues, name: 'with issues' },
        { scan: scanNoIssues, name: 'with no issues' },
    ];

    scans.forEach(({ scan, name }) => it(name, () => {
        const reporter = reporterFactory();
        const parameters = {
            results: scan as AxeResults,
            description,
            serviceName,
            scanContext,
        };
        const html = formatHtmlForSnapshot(reporter.fromAxeResult(parameters).asHTML());
        expect(html).toMatchSnapshot();
    }));
});
