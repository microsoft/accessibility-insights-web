// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty, isString } from 'lodash';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BugFilingService } from '../types/bug-filing-service';
import { SettingsFormProps } from '../types/settings-form-props';
import { createGitHubBugFilingUrl } from './create-gitHub-bug-filing-url';

const GitHubBugFilingServiceKey = 'gitHub';

export type GitHubBugFilingSettings = {
    repository: string;
};

function buildStoreData(repository: string): GitHubBugFilingSettings {
    return {
        repository,
    };
}

function isSettingsValid(data: GitHubBugFilingSettings): boolean {
    return !isEmpty(data) && !isEmpty(data.repository) && isString(data.repository) && !isEmpty(data.repository.trim());
}

const renderSettingsForm = NamedSFC<SettingsFormProps<GitHubBugFilingSettings>>('BugFilingSettings', props => {
    const onGitHubRepositoryChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const propertyName: keyof GitHubBugFilingSettings = 'repository';
        props.deps.userConfigMessageCreator.setBugServiceProperty(GitHubBugFilingServiceKey, propertyName, newValue);
    };

    return (
        <TextField
            className="issue-setting"
            label="Enter desired GitHub repo link:"
            onChange={onGitHubRepositoryChange}
            value={props.settings.repository}
            placeholder="https://github.com/owner/repo"
        />
    );
});

export const GitHubBugFilingService: BugFilingService<GitHubBugFilingSettings> = {
    key: GitHubBugFilingServiceKey,
    displayName: 'GitHub',
    renderSettingsForm,
    buildStoreData,
    isSettingsValid,
    createBugFilingUrl: createGitHubBugFilingUrl,
};
