// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { ReactSFCWithDisplayName } from './../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from './../../common/types/create-issue-details-text-data';
import { SettingsFormProps } from './settings-form-props';

export interface BugFilingService<Settings = {}> {
    key: string;
    isHidden?: boolean;
    displayName: string;
    settingsForm: ReactSFCWithDisplayName<SettingsFormProps<Settings>>;
    buildStoreData: (...params: any[]) => Settings;
    isSettingsValid: (data: Settings) => boolean;
    createBugFilingUrl: (data: Settings, bugData: CreateIssueDetailsTextData) => string;
    getSettingsFromStoreData: (data: BugServicePropertiesMap) => Settings;
}
