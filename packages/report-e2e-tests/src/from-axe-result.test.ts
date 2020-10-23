// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeReportParameters, reporterFactory } from 'accessibility-insights-report';
import * as path from 'path';
import * as prettier from 'prettier';

import { axeResultsWithIssues } from './examples/axe-results-with-issues.input';
import { axeResultsWithoutIssues } from './examples/axe-results-without-issues.input';

describe('fromAxeResult', () => {
    const examples = {
        'axe-results-with-issues': axeResultsWithIssues,
        'axe-results-without-issues': axeResultsWithoutIssues,
    };

    describe.each(Object.keys(examples))('with example input "%s"', (exampleName: string) => {
        const input: AxeReportParameters = examples[exampleName];

        it('produces pinned HTML file', () => {
            const output = reporterFactory().fromAxeResult(input).asHTML();
            const formattedOutput = prettier.format(output, { parser: 'html' });

            const snapshotFile = path.join(__dirname, 'examples', `${exampleName}.output.html`);
            expect(formattedOutput).toMatchFile(snapshotFile);
        });
    });
});
