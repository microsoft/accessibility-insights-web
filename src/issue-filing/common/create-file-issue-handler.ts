// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { IssueFilingServicePropertiesMap } from 'common/types/store-data/user-configuration-store';

import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IssueFilingUrlProvider } from '../types/issue-filing-service';

export const createFileIssueHandler = <Settings>(
    getUrl: IssueFilingUrlProvider<Settings>,
    getSettings: (data: IssueFilingServicePropertiesMap) => Settings,
) => {
    return async (
        browserAdapter: BrowserAdapter,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ): Promise<void> => {
        const serviceConfig = getSettings(servicePropertiesMap);

        const url = getUrl(serviceConfig, issueData, toolData);
        await browserAdapter.createActiveTab(url);
    };
};
