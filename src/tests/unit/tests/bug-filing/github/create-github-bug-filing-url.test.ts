// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { HTTPQueryBuilder } from '../../../../../bug-filing/common/http-query-builder';
import { IssueDetailsBuilder } from '../../../../../bug-filing/common/issue-details-builder';
import { createGitHubIssueFilingUrlProvider } from '../../../../../bug-filing/github/create-github-bug-filing-url';
import { IssueFilingUrlProvider } from '../../../../../bug-filing/types/bug-filing-service';
import { IssueUrlCreationUtils } from './../../../../../bug-filing/common/issue-filing-url-string-utils';
import { GitHubBugFilingSettings } from './../../../../../bug-filing/github/github-bug-filing-service';
import { EnvironmentInfo } from './../../../../../common/environment-info-provider';

const buildedUrl = 'https://builded-url';
describe('createGitHubBugFilingUrlTest', () => {
    let environmentInfo: EnvironmentInfo;
    let sampleIssueDetailsData;
    let settingsData: GitHubBugFilingSettings;
    let stringUtilsMock: IMock<IssueUrlCreationUtils>;
    let issueDetailsGetter: IMock<IssueDetailsBuilder>;
    let testObject: IssueFilingUrlProvider<GitHubBugFilingSettings>;
    let queryBuilderMock: IMock<HTTPQueryBuilder>;

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

        stringUtilsMock = Mock.ofType<IssueUrlCreationUtils>();

        const testTitle = 'test title';
        stringUtilsMock.setup(utils => utils.getTitle(sampleIssueDetailsData)).returns(() => testTitle);
        const testBaseUrl = 'base-url';
        stringUtilsMock.setup(utils => utils.appendIssuesSuffixToGitHubUrl(settingsData.repository)).returns(() => testBaseUrl);

        issueDetailsGetter = Mock.ofType<IssueDetailsBuilder>();
        const testIssueDetails = 'test issue details';
        issueDetailsGetter.setup(getter => getter(environmentInfo, sampleIssueDetailsData)).returns(() => testIssueDetails);

        queryBuilderMock = Mock.ofType<HTTPQueryBuilder>();

        queryBuilderMock.setup(builder => builder.withBaseUrl(`${testBaseUrl}/new`)).returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.withParam('title', testTitle)).returns(() => queryBuilderMock.object);
        queryBuilderMock.setup(builder => builder.withParam('body', testIssueDetails)).returns(() => queryBuilderMock.object);

        queryBuilderMock.setup(builder => builder.build()).returns(() => buildedUrl);

        testObject = createGitHubIssueFilingUrlProvider(stringUtilsMock.object, issueDetailsGetter.object, () => queryBuilderMock.object);
    });

    it('creates url', () => {
        const result = testObject(settingsData, sampleIssueDetailsData, environmentInfo);

        expect(result).toEqual(buildedUrl);
    });
});
