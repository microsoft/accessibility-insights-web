// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { BugFilingService } from '../types/bug-filing-service';
import { SettingsFormProps } from '../types/settings-form-props';

const GitHubBugFilingServiceKey = 'gitHub';

export type GithubBugFilingSettings = {
    repository: string;
};

function buildStoreData(repository: string): GithubBugFilingSettings {
    return {
        repository,
    };
}

function isSettingsValid(data: GithubBugFilingSettings): boolean {
    return !!data && !_.isEmpty(data.repository.trim());
}

const renderSettingsForm = NamedSFC<SettingsFormProps<GithubBugFilingSettings>>('BugFilingSettings', props => {
    const onGitHubRepositoryChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const propertyName: keyof GithubBugFilingSettings = 'repository';
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

export const GitHubBugFilingService: BugFilingService<GithubBugFilingSettings> = {
    key: GitHubBugFilingServiceKey,
    displayName: 'GitHub',
    renderSettingsForm,
    buildStoreData,
    isSettingsValid,
    fileBug: (data: GithubBugFilingSettings, bugData: CreateIssueDetailsTextData) => {
        // coming in with later PR.
    },
};
