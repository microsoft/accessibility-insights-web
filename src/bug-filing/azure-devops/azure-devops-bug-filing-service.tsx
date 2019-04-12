// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import * as React from 'react';

import { EnvironmentInfo } from '../../common/environment-info-provider';
import { NamedSFC } from '../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';
import { BugFilingService } from '../types/bug-filing-service';
import { SettingsFormProps } from '../types/settings-form-props';

const AzureDevOpsBugFilingServiceKey = 'azureDevOps';

export type AzureDevOpsBugFilingSettings = {
    projectURL: string;
    issueDetailsLocationField: string;
};

function buildStoreData(projectURL: string, issueDetailsLocationField: string): AzureDevOpsBugFilingSettings {
    return {
        projectURL,
        issueDetailsLocationField,
    };
}

function getSettingsFromStoreData(bugServicePropertiesMap: BugServicePropertiesMap): AzureDevOpsBugFilingSettings {
    return bugServicePropertiesMap[AzureDevOpsBugFilingServiceKey] as AzureDevOpsBugFilingSettings;
}

function isSettingsValid(data: AzureDevOpsBugFilingSettings): boolean {
    return !isEmpty(data) && isStringValid(data.projectURL) && isStringValid(data.issueDetailsLocationField);
}

function isStringValid(stringToCheck: string): boolean {
    return !isEmpty(stringToCheck) && !isEmpty(stringToCheck.trim());
}

const settingsForm = NamedSFC<SettingsFormProps<AzureDevOpsBugFilingSettings>>('BugFilingSettings', props => {
    return <div />;
});

export const AzureDevOpsBugFilingService: BugFilingService<AzureDevOpsBugFilingSettings> = {
    key: AzureDevOpsBugFilingServiceKey,
    displayName: 'AzureDevOps',
    settingsForm,
    buildStoreData,
    getSettingsFromStoreData,
    isSettingsValid,
    createBugFilingUrl: (data: AzureDevOpsBugFilingSettings, bugData: CreateIssueDetailsTextData, environmentInfo: EnvironmentInfo) => null,
};
