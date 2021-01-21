// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';

import { OpenIssueLink } from 'issue-filing/common/create-file-issue-handler';
import { IssueFilingServiceProvider } from '../issue-filing-service-provider';

export type IssueFilingController = {
    fileIssue: (
        serviceKey: string,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ) => void;
};

export class IssueFilingControllerImpl implements IssueFilingController {
    constructor(
        private readonly openIssueLink: OpenIssueLink,
        private readonly provider: IssueFilingServiceProvider,
        private readonly userConfigurationStore: BaseStore<UserConfigurationStoreData>,
    ) {}

    public fileIssue = (
        serviceKey: string,
        issueData: CreateIssueDetailsTextData,
        toolData: ToolData,
    ): Promise<void> => {
        const service = this.provider.forKey(serviceKey);
        const userConfigurationStoreData = this.userConfigurationStore.getState();

        return service.fileIssue(
            this.openIssueLink,
            userConfigurationStoreData.bugServicePropertiesMap,
            issueData,
            toolData,
        );
    };
}
