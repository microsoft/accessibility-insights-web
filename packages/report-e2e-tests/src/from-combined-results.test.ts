// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { reporterFactory, CombinedReportParameters } from 'accessibility-insights-report';
import * as path from 'path';
import * as prettier from 'prettier';

import { combinedResultsWithIssues } from './examples/combined-results-with-issues.input';
import { combinedResultsWithoutIssues } from './examples/combined-results-without-issues.input';

describe('fromCombinedResults', () => {
    const examples = {
        'combined-results-with-issues': combinedResultsWithIssues,
        'combined-results-without-issues': combinedResultsWithoutIssues,
    };

    describe.each(Object.keys(examples))('with example input "%s"', (exampleName: string) => {
        const input: CombinedReportParameters = examples[exampleName];

        it('produces pinned HTML file', () => {
            const output = reporterFactory().fromCombinedResults(input).asHTML();
            const formattedOutput = prettier.format(output, {
                parser: 'html',
                htmlWhitespaceSensitivity: 'strict',
            });

            const snapshotFile = path.join(__dirname, 'examples', `${exampleName}.snap.html`);
            expect(formattedOutput).toMatchFile(snapshotFile);
        });
    });
});
