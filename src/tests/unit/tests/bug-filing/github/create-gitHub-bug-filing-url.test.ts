// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, It } from 'typemoq';

import { createGitHubBugFilingUrl } from '../../../../../bug-filing/github/create-gitHub-bug-filing-url';
import { BugFilingUrlStringUtils } from './../../../../../bug-filing/common/bug-filing-url-string-utils';
import { GitHubBugFilingSettings } from './../../../../../bug-filing/github/github-bug-filing-service';
import { EnvironmentInfo } from './../../../../../common/environment-info.-provider';

describe('createGitHubBugFilingUrlTest', () => {
    const environmentInfo: EnvironmentInfo = {
        extensionVersion: '1.1.1',
        axeCoreVersion: '2.2.2',
        browserSpec: 'test spec',
    };
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
    const settingsData: GitHubBugFilingSettings = {
        repository: 'test repo',
    };
    const footerMock = GlobalMock.ofInstance(BugFilingUrlStringUtils.footer, 'footer', BugFilingUrlStringUtils);
    footerMock.setup(f => f(It.isAny())).returns(() => 'test footer');
    const collapseConsecutiveSpacesMock = GlobalMock.ofInstance(
        BugFilingUrlStringUtils.collapseConsecutiveSpaces,
        'collapseConsecutiveSpaces',
        BugFilingUrlStringUtils,
    );
    collapseConsecutiveSpacesMock.setup(c => c(It.isAny())).returns(() => 'collapesd');
    const markdownEscapeBlockMock = GlobalMock.ofInstance(
        BugFilingUrlStringUtils.markdownEscapeBlock,
        'markdownEscapeBlock',
        BugFilingUrlStringUtils,
    );
    markdownEscapeBlockMock.setup(m => m(It.isAny())).returns(() => 'escaped');

    const getSelectorLastPartMock = GlobalMock.ofInstance(
        BugFilingUrlStringUtils.getSelectorLastPart,
        'getSelectorLastPart',
        BugFilingUrlStringUtils,
    );
    getSelectorLastPartMock.setup(g => g(It.isAny())).returns(() => 'last part');
    const standardizeTagsMock = GlobalMock.ofInstance(BugFilingUrlStringUtils.standardizeTags, 'standardizeTags', BugFilingUrlStringUtils);

    test('createGitHubBugFilingUrl: no prefix', () => {
        standardizeTagsMock.setup(s => s(It.isAny())).returns(() => []);
        GlobalScope.using(
            footerMock,
            collapseConsecutiveSpacesMock,
            markdownEscapeBlockMock,
            getSelectorLastPartMock,
            standardizeTagsMock,
        ).with(() => {
            expect(createGitHubBugFilingUrl(settingsData, sampleIssueDetailsData, environmentInfo)).toMatchSnapshot();
        });
    });

    test('createGitHubBugFilingUrl: no prefix', () => {
        standardizeTagsMock.setup(s => s(It.isAny())).returns(() => ['TAG1', 'TAG2']);
        GlobalScope.using(
            footerMock,
            collapseConsecutiveSpacesMock,
            markdownEscapeBlockMock,
            getSelectorLastPartMock,
            standardizeTagsMock,
        ).with(() => {
            expect(createGitHubBugFilingUrl(settingsData, sampleIssueDetailsData, environmentInfo)).toMatchSnapshot();
        });
    });
});
