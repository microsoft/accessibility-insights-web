// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../../background/browser-adapters/browser-adapter';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueFilingServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { IssueFilingUrlProvider } from '../types/issue-filing-service';

export const createFileIssueHandler = <Settings>(
    urlProvider: IssueFilingUrlProvider<Settings>,
    settingsGetter: (data: IssueFilingServicePropertiesMap) => Settings,
) => {
    return (
        browserAdapter: BrowserAdapter,
        servicePropertiesMap: IssueFilingServicePropertiesMap,
        issueData: CreateIssueDetailsTextData,
        environmentInfo: EnvironmentInfo,
    ): void => {
        const serviceConfig = settingsGetter(servicePropertiesMap);

        const url = urlProvider(serviceConfig, issueData, environmentInfo);
        browserAdapter.createTab(url);
    };
};
