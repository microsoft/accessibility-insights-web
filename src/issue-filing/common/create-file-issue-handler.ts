// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IssueFilingServicePropertiesMap } from 'common/types/store-data/user-configuration-store';

import { IssueFilingUrlProvider } from '../types/issue-filing-service';

export type OpenIssueLink = (url: string) => Promise<any>;

export const createFileIssueHandler = <Settings>(
    getUrl: IssueFilingUrlProvider<Settings>,
    getSettings: (data: IssueFilingServicePropertiesMap) => Settings,
) => {
    return async (
        openIssueLink: OpenIssueLink,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ): Promise<void> => {
        const serviceConfig = getSettings(servicePropertiesMap);

        const url = getUrl(serviceConfig, issueData, toolData);
        await openIssueLink(url);
    };
};
