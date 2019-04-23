// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { title } from '../../content/strings/application';
import { getIssueDetailsHtml } from '../common/get-issue-details-html';
import { HTTPQueryBuilder } from '../common/http-query-builder';
import { IssueDetailsGetter } from '../common/issue-details-getter';
import { IssueFilingUrlStringUtils, IssueUrlCreationUtils } from '../common/issue-filing-url-string-utils';
import { AzureBoardsBugFilingSettings } from './azure-boards-bug-filing-service';

const buildTags = (createBugData: CreateIssueDetailsTextData, standardTags: string[]): string => {
    const tags = ['Accessibility', title, `rule: ${createBugData.ruleResult.ruleId}`, ...standardTags];
    return tags.join('; ');
};

export const createAzureBoardsIssueFilingUrlProvider = (
    stringUtils: IssueUrlCreationUtils,
    issueDetailsGetter: IssueDetailsGetter,
    queryBuilderProvider: () => HTTPQueryBuilder,
) => {
    return (settingsData: AzureBoardsBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo) => {
        const titleField = stringUtils.getTitle(bugData);
        const standardTags = stringUtils.standardizeTags(bugData);
        const tags = buildTags(bugData, standardTags);
        const body = issueDetailsGetter(stringUtils, environmentInfo, bugData);

        let bodyField: string = '[Microsoft.VSTS.TCM.ReproSteps]';

        if (settingsData.issueDetailsField === 'description') {
            bodyField = '[System.Description]';
        }

        return queryBuilderProvider()
            .withBaseUrl(`${settingsData.projectURL}/_workitems/create/Bug`)
            .withParam('fullScreen', 'true')
            .withParam('[System.Title]', titleField)
            .withParam('[System.Tags]', tags)
            .withParam(bodyField, body)
            .build();
    };
};

export const azureBoardsIssueFilingUrlProvider = createAzureBoardsIssueFilingUrlProvider(
    IssueFilingUrlStringUtils,
    getIssueDetailsHtml,
    () => new HTTPQueryBuilder(),
);
