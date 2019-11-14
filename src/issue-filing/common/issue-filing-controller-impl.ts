// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../../common/base-store';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { IssueFilingServiceProvider } from '../issue-filing-service-provider';

export type IssueFilingController = {
    fileIssue: (
        serviceKey: string,
        issueData: CreateIssueDetailsTextData,
    ) => void;
};

export class IssueFilingControllerImpl implements IssueFilingController {
    constructor(
        private readonly provider: IssueFilingServiceProvider,
        private readonly browserAdapter: BrowserAdapter,
        private readonly environmentInfo: EnvironmentInfo,
        private readonly userConfigurationStore: BaseStore<
            UserConfigurationStoreData
        >,
    ) {}

    public fileIssue = (
        serviceKey: string,
        issueData: CreateIssueDetailsTextData,
    ): void => {
        const service = this.provider.forKey(serviceKey);
        const userConfigurationStoreData = this.userConfigurationStore.getState();

        service.fileIssue(
            this.browserAdapter,
            userConfigurationStoreData.bugServicePropertiesMap,
            issueData,
            this.environmentInfo,
        );
    };
}
