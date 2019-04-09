// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';

export interface BugFilingService<Settings = {}> {
    key: string;
    displayName: string;
    renderSettingsForm: React.SFC;
    buildStoreData: (params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    createBugFilingUrl: (data: Settings, bugData: CreateIssueDetailsTextData) => string;
}
