// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { resetIds } from '@fluentui/react';
import { AxeReportParameters, reporterFactory } from 'accessibility-insights-report';
// TODO: Restore usage of prettier once the Node update feature is complete
//import * as prettier from 'prettier';

import { axeResultsWithIssues } from './examples/axe-results-with-issues.input';
import { axeResultsWithoutIssues } from './examples/axe-results-without-issues.input';

describe('fromAxeResult', () => {
    const examples = {
        'axe-results-with-issues': axeResultsWithIssues,
        'axe-results-without-issues': axeResultsWithoutIssues,
    };

    describe.each(Object.keys(examples))('with example input "%s"', (exampleName: string) => {
        const input: AxeReportParameters = examples[exampleName];

        beforeEach(() => {
            // Reset office fabric's id counter so changes to
            // the id counts in one test will not affect the others
            resetIds();
        });

        it('produces pinned HTML file', async () => {
            const output = reporterFactory().fromAxeResult(input).asHTML();
            // const formattedOutput = await prettier.format(output, {
            //     parser: 'html',
            //     htmlWhitespaceSensitivity: 'strict',
            // });

            const snapshotFile = path.join(__dirname, 'examples', `${exampleName}.snap.html`);
            expect(output).toMatchFile(snapshotFile);
        });
    });
});
