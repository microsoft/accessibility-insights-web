// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';
import { createDefaultHandler } from '../../../../../bug-filing/github/create-github-bug-filing-url';
import { issueFilingUrlCreator } from '../../../../../bug-filing/types/bug-filing-service';
import { StringUtils } from './../../../../../bug-filing/common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './../../../../../bug-filing/github/github-bug-filing-service';
import { EnvironmentInfo } from './../../../../../common/environment-info-provider';

describe('createGitHubBugFilingUrlTest', () => {
    let environmentInfo: EnvironmentInfo;
    let sampleIssueDetailsData;
    let settingsData: GitHubBugFilingSettings;
    let stringUtilsMock: IMock<StringUtils>;
    let testObject: issueFilingUrlCreator<GitHubBugFilingSettings>;

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

        stringUtilsMock = Mock.ofType<StringUtils>();
        testObject = createDefaultHandler(stringUtilsMock.object);
    });

    test('createGitHubBugFilingUrl: no tag', () => {
        stringUtilsMock.setup(utils => utils.standardizeTags(sampleIssueDetailsData)).returns(() => []);
        stringUtilsMock.setup(utils => utils.getSelectorLastPart(It.isAny())).returns(() => 'last part');
        stringUtilsMock.setup(utils => utils.collapseConsecutiveSpaces(It.isAnyString())).returns(() => 'collapsed');
        stringUtilsMock.setup(utils => utils.markdownEscapeBlock(It.isAnyString())).returns(() => 'escaped');
        stringUtilsMock.setup(utils => utils.footer(environmentInfo)).returns(() => 'test footer');

        const result = testObject(settingsData, sampleIssueDetailsData, environmentInfo);

        expect(result).toMatchSnapshot();
    });

    test('createGitHubBugFilingUrl: with tag', () => {
        stringUtilsMock.setup(utils => utils.standardizeTags(sampleIssueDetailsData)).returns(() => ['TAG1', 'TAG2']);
        stringUtilsMock.setup(utils => utils.getSelectorLastPart(It.isAny())).returns(() => 'last part');
        stringUtilsMock.setup(utils => utils.collapseConsecutiveSpaces(It.isAnyString())).returns(() => 'collapsed');
        stringUtilsMock.setup(utils => utils.markdownEscapeBlock(It.isAnyString())).returns(() => 'escaped');
        stringUtilsMock.setup(utils => utils.footer(environmentInfo)).returns(() => 'test footer');

        const result = testObject(settingsData, sampleIssueDetailsData, environmentInfo);

        expect(result).toMatchSnapshot();
    });
});
