// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from '../../background/browser-adapter';
import { BaseStore } from '../../common/base-store';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugServiceProperties, UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { BugFilingServiceProvider } from '../bug-filing-service-provider';

export type IssueFilingController = {
    fileIssue: (serviceKey: string, issueData: CreateIssueDetailsTextData) => void;
};

export class IssueFilingControllerImpl implements IssueFilingController {
    constructor(
        private readonly provider: BugFilingServiceProvider,
        private readonly browserAdapter: BrowserAdapter,
        private readonly environmentInfo: EnvironmentInfo,
        private readonly userConfigurationStore: BaseStore<UserConfigurationStoreData>,
    ) {}

    public fileIssue = (serviceKey: string, issueData: CreateIssueDetailsTextData): void => {
        const service = this.provider.forKey(serviceKey);
        const userConfigurationStoreData = this.userConfigurationStore.getState();

        const serviceConfig: BugServiceProperties = service.getSettingsFromStoreData(userConfigurationStoreData.bugServicePropertiesMap);

        const url = service.issueFilingUrlProvider(serviceConfig, issueData, this.environmentInfo);
        this.browserAdapter.createTab(url);
    };
}
