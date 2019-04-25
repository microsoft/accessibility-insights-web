// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FileIssueClickService } from '../../common/telemetry-events';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugFilingServiceProvider } from '../bug-filing-service-provider';
import { BrowserAdapter } from '../../background/browser-adapter';
import { EnvironmentInfo } from '../../common/environment-info-provider';

export type IssueFilingController = {
    fileIssue: (serviceKey: FileIssueClickService, issueData: CreateIssueDetailsTextData) => void;
};

export class IssueFilingControllerImpl implements IssueFilingController {
    constructor(
        private readonly provider: BugFilingServiceProvider,
        private readonly browserAdapter: BrowserAdapter,
        private readonly environmentInfo: EnvironmentInfo,
    ) {}

    public fileIssue = (serviceKey: FileIssueClickService, issueData: CreateIssueDetailsTextData): void => {
        const service = this.provider.forKey(serviceKey);
        const url = service.issueFilingUrlProvider(service, issueData, this.environmentInfo);
        this.browserAdapter.createTab(url);
    };
}
