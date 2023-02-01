// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { CreateIssueDetailsTextData } from '../../../common/types/create-issue-details-text-data';
import { HTTPQueryBuilder } from '../../common/http-query-builder';
import { IssueDetailsBuilder } from '../../common/issue-details-builder';
import {
    IssueFilingUrlStringUtils,
    IssueUrlCreationUtils,
} from '../../common/issue-filing-url-string-utils';
import { GitHubIssueFilingSettings } from './github-issue-filing-settings';
import { rectify, UrlRectifier } from './github-url-rectifier';

export const createGitHubIssueFilingUrlProvider = (
    stringUtils: IssueUrlCreationUtils,
    issueDetailsBuilder: IssueDetailsBuilder,
    queryBuilderProvider: () => HTTPQueryBuilder,
    rectifier: UrlRectifier,
) => {
    return (
        settingsData: GitHubIssueFilingSettings,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ): string => {
        const title = stringUtils.getTitle(issueData);
        const body = issueDetailsBuilder(toolData, issueData, { isLengthConstrained: true });

        const baseUrl = rectifier(settingsData.repository);

        return queryBuilderProvider()
            .withBaseUrl(`${baseUrl}/new`)
            .withParam('title', title)
            .withParam('body', body)
            .build();
    };
};

export const gitHubIssueFilingUrlProvider = (issueDetailsBuilder: IssueDetailsBuilder) =>
    createGitHubIssueFilingUrlProvider(
        IssueFilingUrlStringUtils,
        issueDetailsBuilder,
        () => new HTTPQueryBuilder(),
        rectify,
    );
