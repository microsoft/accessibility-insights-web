// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingUrlStringUtils } from './../../../../../bug-filing/common/issue-filing-url-string-utils';
import { EnvironmentInfo } from './../../../../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';

describe('BugFilingUrlStringUtilsTest', () => {
    let environmentInfo: EnvironmentInfo;
    let sampleIssueDetailsData: CreateIssueDetailsTextData;

    beforeEach(() => {
        environmentInfo = {
            extensionVersion: '1.1.1',
            axeCoreVersion: '2.2.2',
            browserSpec: 'test spec',
        };
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

    test('getFooter', () => {
        expect(IssueFilingUrlStringUtils.getFooter(environmentInfo)).toMatchSnapshot();
    });

    test('collapseConsecutiveSpaces', () => {
        expect(IssueFilingUrlStringUtils.collapseConsecutiveSpaces('This    is   a  test   string')).toEqual('This is a test string');
    });

    test('markdownEscapeBlock', () => {
        expect(IssueFilingUrlStringUtils.formatAsMarkdownCodeBlock('hello\nworld')).toEqual('    hello\n    world');
    });

    test('appendSuffixToUrl', () => {
        expect(IssueFilingUrlStringUtils.appendSuffixToUrl('repo', 'hello')).toEqual('repo/hello/');
        expect(IssueFilingUrlStringUtils.appendSuffixToUrl('repo/hello', 'hello')).toEqual('repo/hello');
        expect(IssueFilingUrlStringUtils.appendSuffixToUrl('repo/hello/', 'hello')).toEqual('repo/hello/');
        expect(IssueFilingUrlStringUtils.appendSuffixToUrl('repo/hello', 'world')).toEqual('repo/hello/world/');
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
