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
import {
    AzureBoardsIssueFilingSettings,
    AzureBoardsWorkItemType,
} from './azure-boards-issue-filing-settings';

const buildTags = (
    createIssueData: CreateIssueDetailsTextData,
    standardTags: string[],
    toolTitle: string,
): string => {
    const tags = ['Accessibility', toolTitle, `rule: ${createIssueData.rule.id}`, ...standardTags];
    return tags.join('; ');
};

export const createAzureBoardsIssueFilingUrlProvider = (
    stringUtils: IssueUrlCreationUtils,
    issueDetailsBuilder: IssueDetailsBuilder,
    queryBuilderProvider: () => HTTPQueryBuilder,
) => {
    return (
        settingsData: AzureBoardsIssueFilingSettings,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ) => {
        const titleField = stringUtils.getTitle(issueData);
        const standardTags = stringUtils.standardizeTags(issueData);
        const tags = buildTags(issueData, standardTags, toolData.applicationProperties.name);
        const body = issueDetailsBuilder(toolData, issueData);

        let bodyField: string = '[Microsoft.VSTS.TCM.ReproSteps]';
        let workItemType: AzureBoardsWorkItemType = 'Bug';

        if (settingsData.issueDetailsField === 'description') {
            bodyField = '[System.Description]';
            workItemType = 'Issue';
        }

        return queryBuilderProvider()
            .withBaseUrl(`${settingsData.projectURL}/_workitems/create/${workItemType}`)
            .withParam('fullScreen', 'true')
            .withParam('[System.Title]', titleField)
            .withParam('[System.Tags]', tags)
            .withParam(bodyField, body)
            .build();
    };
};

export const azureBoardsIssueFilingUrlProvider = (issueDetailsBuilder: IssueDetailsBuilder) =>
    createAzureBoardsIssueFilingUrlProvider(
        IssueFilingUrlStringUtils,
        issueDetailsBuilder,
        () => new HTTPQueryBuilder(),
    );
