// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { IssueFilingUrlStringUtils } from './../../../../../bug-filing/common/issue-filing-url-string-utils';

describe('BugFilingUrlStringUtilsTest', () => {
    let sampleIssueDetailsData: CreateIssueDetailsTextData;

    beforeEach(() => {
        sampleIssueDetailsData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
                failureSummary: 'RR-failureSummary',
                guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
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

    describe('appendIssuesSuffixToGitHubUrl', () => {
        const shouldAddSuffixTestCases = [
            'https://github.com/me/my-repo',
            'https://github.com/me/my-repo/',
            'http://github.com/me/my-repo',
            'http://github.com/me/my-repo/',
            // the following 2 cases represent real cases where the repo name is 'issues'
            // we still want to append the suffix in this cases
            'http://github.com/me/issues/',
            'http://github.com/me/issues',
        ];

        it.each(shouldAddSuffixTestCases)('should append to: %s', (url: string) => {
            const expected = url + (url[url.length - 1] === '/' ? 'issues' : '/issues');
            expect(IssueFilingUrlStringUtils.appendIssuesSuffixToGitHubUrl(url)).toEqual(expected);
        });

        const shouldNotChangeTestCases = [
            'this doesnt match',
            'https://github.com/mine/my-repo/pull-request',
            'file://my-files/issue.text',
        ];

        it.each(shouldNotChangeTestCases)('should not change: %s', url => {
            expect(IssueFilingUrlStringUtils.appendIssuesSuffixToGitHubUrl(url)).toEqual(url);
        });
    });

    test('getSelectorLastPart', () => {
        expect(IssueFilingUrlStringUtils.getSelectorLastPart('hello world')).toEqual('hello world');
        expect(IssueFilingUrlStringUtils.getSelectorLastPart('hello > world')).toEqual('world');
    });

    test('standardizeTags', () => {
        const expected = ['WCAG-1.4.1', 'WCAG-2.8.2'];
        expect(IssueFilingUrlStringUtils.standardizeTags(sampleIssueDetailsData)).toEqual(expected);
    });
});
