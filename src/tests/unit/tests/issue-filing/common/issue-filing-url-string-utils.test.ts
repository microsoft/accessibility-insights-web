// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { IssueFilingUrlStringUtils } from './../../../../../issue-filing/common/issue-filing-url-string-utils';

describe('IssueFilingUrlStringUtilsTest', () => {
    let sampleIssueDetailsData: CreateIssueDetailsTextData;

    beforeEach(() => {
        sampleIssueDetailsData = {
            rule: {
                description: 'RR-help',
                id: 'RR-rule-id',
                url: 'RR-help-url',
                guidance: [
                    {
                        text: 'WCAG-1.4.1',
                        tags: [
                            { id: 'some-id', displayText: 'some displayText' },
                            { id: 'some-other-id', displayText: 'some other displayText' },
                        ],
                    },
                    { text: 'wcag-2.8.2' },
                ],
            } as any,
            targetApp: {
                name: 'pageTitle<x>',
                url: 'pageUrl',
            },
            element: {
                identifier: 'RR-selector<x>',
                conciseName: 'RR-selector<x>',
            },
            howToFixSummary: 'RR-failureSummary',
            snippet: 'RR-snippet   space',
        };
    });

    describe('getTitle', () => {
        test('with tags', () => {
            expect(IssueFilingUrlStringUtils.getTitle(sampleIssueDetailsData)).toMatchSnapshot();
        });

        test('without tags', () => {
            sampleIssueDetailsData.rule.guidance = [];

            expect(IssueFilingUrlStringUtils.getTitle(sampleIssueDetailsData)).toMatchSnapshot();
        });
    });

    describe('getSelectorLastPart', () => {
        const testCases = [
            ['hello world', 'hello world'],
            ['hello > world', 'world'],
            ['iframe[name="image-text"];html', 'html'],
            ['iframe[name="image-text"];a > img:nth-child(2)', 'img:nth-child(2)'],
        ];

        it.each(testCases)('find the selector last part for "%s"', (input, expected) => {
            expect(IssueFilingUrlStringUtils.getSelectorLastPart(input)).toEqual(expected);
        });
    });

    test('standardizeTags', () => {
        const expected = ['WCAG-1.4.1', 'WCAG-2.8.2', 'some displayText', 'some other displayText'];
        expect(IssueFilingUrlStringUtils.standardizeTags(sampleIssueDetailsData)).toEqual(expected);
    });
});
