// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { It, Mock, Times } from 'typemoq';
import { CreateIssueDetailsTextData } from '../../../../common/types/create-issue-details-text-data';
import { AxeResultToIssueFilingDataConverter } from '../../../../issue-filing/rule-result-to-issue-filing-data';

describe('AxeResultToIssueFilingDataConverter', () => {
    test('constructor', () => {
        const shortenSelector = selector => 'short';
        const converter = new AxeResultToIssueFilingDataConverter(shortenSelector);
        expect(converter).not.toBeNull();
    });

    test('convert', () => {
        const result: DecoratedAxeNodeResult = {
            failureSummary: 'RR-failureSummary',
            guidanceLinks: [
                {
                    text: 'WCAG-1.4.1',
                    tags: [
                        { id: 'some-id', displayText: 'some displayText' },
                        { id: 'some-other-id', displayText: 'some other displayText' },
                    ],
                },
                { text: 'wcag-2.8.2' },
            ] as any,
            help: 'RR-help',
            html: 'RR-html',
            ruleId: 'RR-rule-id',
            helpUrl: 'RR-help-url',
            selector: 'RR-selector<x>',
        } as any;
        const fakePageTitle = 'title';
        const fakePageUrl = 'url';

        const expected: CreateIssueDetailsTextData = {
            rule: {
                description: result.help,
                id: result.ruleId,
                url: result.helpUrl,
                guidance: result.guidanceLinks,
            },
            targetApp: {
                name: fakePageTitle,
                url: fakePageUrl,
            },
            element: {
                identifier: result.selector,
                conciseName: 'short',
            },
            howToFixSummary: result.failureSummary,
            snippet: result.html,
        };

        const shortenSelector = Mock.ofInstance((str): string => '');
        shortenSelector
            .setup(m => m(It.isAnyString()))
            .returns(_ => 'short')
            .verifiable(Times.once());
        const converter = new AxeResultToIssueFilingDataConverter(shortenSelector.object);
        const textData = converter.convert(result, fakePageTitle, fakePageUrl);
        expect(textData).toEqual(expected);
        shortenSelector.verifyAll();
    });
});
