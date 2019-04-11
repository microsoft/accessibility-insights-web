// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingUrlStringUtils } from './../../../../../bug-filing/common/issue-filing-url-string-utils';
import { EnvironmentInfo } from './../../../../../common/environment-info-provider';

describe('BugFilingUrlStringUtilsTest', () => {
    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.1.1',
        axeCoreVersion: '2.2.2',
        browserSpec: 'test spec',
    };

    test('footer', () => {
        expect(IssueFilingUrlStringUtils.footer(environmentInfo)).toMatchSnapshot();
    });

    test('collapseConsecutiveSpaces', () => {
        expect(IssueFilingUrlStringUtils.collapseConsecutiveSpaces('This    is   a  test   string')).toEqual('This is a test string');
    });

    test('markdownEscapeBlock', () => {
        expect(IssueFilingUrlStringUtils.markdownEscapeBlock('hello\nworld')).toEqual('    hello\n    world');
    });

    test('getSelectorLastPart', () => {
        expect(IssueFilingUrlStringUtils.getSelectorLastPart('hello world')).toEqual('hello world');
        expect(IssueFilingUrlStringUtils.getSelectorLastPart('hello > world')).toEqual('world');
    });

    test('standardizeTags', () => {
        const sampleIssueDetailsData = {
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
            } as any,
        };

        const expected = ['WCAG-1.4.1', 'WCAG-2.8.2'];
        expect(IssueFilingUrlStringUtils.standardizeTags(sampleIssueDetailsData)).toEqual(expected);
    });
});
