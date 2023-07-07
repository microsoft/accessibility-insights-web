// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { resetIds } from '@fluentui/react';
import { reporterFactory, CombinedReportParameters } from 'accessibility-insights-report';
import * as prettier from 'prettier';

import { combinedResultsWithBaselineAwareIssues } from './examples/combined-results-with-baseline-aware-issues';
import { combinedResultsWithIssues } from './examples/combined-results-with-issues.input';
import { combinedResultsWithoutIssues } from './examples/combined-results-without-issues.input';

describe('fromCombinedResults', () => {
    const examples = {
        'combined-results-with-issues': combinedResultsWithIssues,
        'combined-results-without-issues': combinedResultsWithoutIssues,
        'combined-results-with-baseline-aware-issues': combinedResultsWithBaselineAwareIssues,
    };

    describe.each(Object.keys(examples))('with example input "%s"', (exampleName: string) => {
        const input: CombinedReportParameters = examples[exampleName];

        beforeEach(() => {
            // Reset office fabric's id counter so changes to
            // the id counts in one test will not affect the others
            resetIds();
        });

        it('produces pinned HTML file', async () => {
            const output = reporterFactory().fromCombinedResults(input).asHTML();
            const formattedOutput = await prettier.format(output, {
                parser: 'html',
                htmlWhitespaceSensitivity: 'strict',
            });

            const snapshotFile = path.join(__dirname, 'examples', `${exampleName}.snap.html`);
            expect(formattedOutput).toMatchFile(snapshotFile);
        });
    });
});
