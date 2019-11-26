// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { EnvironmentInfo } from 'common/environment-info-provider';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { IssueFilingServicePropertiesMap } from 'common/types/store-data/user-configuration-store';

import { IssueFilingUrlProvider } from '../types/issue-filing-service';

export const createFileIssueHandler = <Settings>(
    getUrl: IssueFilingUrlProvider<Settings>,
    getSettings: (data: IssueFilingServicePropertiesMap) => Settings,
) => {
    return async (
        browserAdapter: BrowserAdapter,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: CreateIssueDetailsTextData,
        environmentInfo: EnvironmentInfo,
    ): Promise<void> => {
        const serviceConfig = getSettings(servicePropertiesMap);

        const url = getUrl(serviceConfig, issueData, environmentInfo);
        await browserAdapter.createActiveTab(url);
    };
};
