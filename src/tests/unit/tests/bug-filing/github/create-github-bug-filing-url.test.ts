// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It } from 'typemoq';

import { createGitHubBugFilingUrl } from '../../../../../bug-filing/github/create-github-bug-filing-url';
import { IssueFilingUrlStringUtils } from './../../../../../bug-filing/common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './../../../../../bug-filing/github/github-bug-filing-service';
import { EnvironmentInfo } from './../../../../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from './../../../../../common/types/create-issue-details-text-data';

describe('createGitHubBugFilingUrlTest', () => {
    let environmentInfo: EnvironmentInfo;
    let sampleIssueDetailsData;
    let settingsData: GitHubBugFilingSettings;
    let footerMock: IGlobalMock<(environmentInfo: EnvironmentInfo) => string>;
    let collapseConsecutiveSpacesMock: IGlobalMock<(input: string) => string>;
    let markdownEscapeBlockMock: IGlobalMock<(input: string) => string>;
    let getSelectorLastPartMock: IGlobalMock<(selector: string) => string>;
    let standardizeTagsMock: IGlobalMock<(data: CreateIssueDetailsTextData) => string[]>;

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
            } as any,
        };
        settingsData = {
            repository: 'test repo',
        };
        footerMock = GlobalMock.ofInstance(IssueFilingUrlStringUtils.footer, 'footer', IssueFilingUrlStringUtils);
        footerMock.setup(f => f(It.isAny())).returns(() => 'test footer');
        collapseConsecutiveSpacesMock = GlobalMock.ofInstance(
            IssueFilingUrlStringUtils.collapseConsecutiveSpaces,
            'collapseConsecutiveSpaces',
            IssueFilingUrlStringUtils,
        );
        collapseConsecutiveSpacesMock.setup(c => c(It.isAny())).returns(() => 'collapesd');
        markdownEscapeBlockMock = GlobalMock.ofInstance(
            IssueFilingUrlStringUtils.markdownEscapeBlock,
            'markdownEscapeBlock',
            IssueFilingUrlStringUtils,
        );
        markdownEscapeBlockMock.setup(m => m(It.isAny())).returns(() => 'escaped');
        getSelectorLastPartMock = GlobalMock.ofInstance(
            IssueFilingUrlStringUtils.getSelectorLastPart,
            'getSelectorLastPart',
            IssueFilingUrlStringUtils,
        );
        getSelectorLastPartMock.setup(g => g(It.isAny())).returns(() => 'last part');
        standardizeTagsMock = GlobalMock.ofInstance(
            IssueFilingUrlStringUtils.standardizeTags,
            'standardizeTags',
            IssueFilingUrlStringUtils,
        );
    });

    test('createGitHubBugFilingUrl: no tag', () => {
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

    test('createGitHubBugFilingUrl: ends with /issues ', () => {
        settingsData.repository = 'repo/issues';
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

    test('createGitHubBugFilingUrl: with tag', () => {
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
