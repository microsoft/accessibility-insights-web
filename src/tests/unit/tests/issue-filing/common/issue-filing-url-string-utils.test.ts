// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { IssueFilingUrlStringUtils } from './../../../../../issue-filing/common/issue-filing-url-string-utils';

describe('IssueFilingUrlStringUtilsTest', () => {
    let sampleIssueDetailsData: CreateIssueDetailsTextData;

    beforeEach(() => {
        sampleIssueDetailsData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
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
                ],
                help: 'RR-help',
                html: 'RR-html',
                ruleId: 'RR-rule-id',
                helpUrl: 'RR-help-url',
                selector: 'RR-selector<x>',
                snippet: 'RR-snippet   space',
            } as DecoratedAxeNodeResult,
        };
    });

    describe('getTitle', () => {
        test('with tags', () => {
            expect(IssueFilingUrlStringUtils.getTitle(sampleIssueDetailsData)).toMatchSnapshot();
        });

        test('without tags', () => {
            sampleIssueDetailsData.ruleResult.guidanceLinks = [];

            expect(IssueFilingUrlStringUtils.getTitle(sampleIssueDetailsData)).toMatchSnapshot();
        });
    });

    describe('getSelectorLastPart', () => {
        const testCases = [['hello world', 'hello world'], ['hello > world', 'world'], ['iframe[name="image-text"];html', 'html']];

        it.each(testCases)('find the selector last part for "%s"', (input, expected) => {
            expect(IssueFilingUrlStringUtils.getSelectorLastPart(input)).toEqual(expected);
        });
    });

    test('standardizeTags', () => {
        const expected = ['WCAG-1.4.1', 'WCAG-2.8.2', 'some displayText', 'some other displayText'];
        expect(IssueFilingUrlStringUtils.standardizeTags(sampleIssueDetailsData)).toEqual(expected);
    });
});
