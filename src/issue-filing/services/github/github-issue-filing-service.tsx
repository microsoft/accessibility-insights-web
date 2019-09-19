// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty, isString } from 'lodash';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import { createFileIssueHandler } from '../../common/create-file-issue-handler';
import { createSettingsGetter } from '../../common/create-settings-getter';
import { IssueFilingService } from '../../types/issue-filing-service';
import { SettingsFormProps } from '../../types/settings-form-props';
import { gitHubIssueFilingUrlProvider } from './create-github-issue-filing-url';
import { GitHubIssueFilingSettings } from './github-issue-filing-settings';

const GitHubIssueFilingServiceKey = 'gitHub';

function buildStoreData(repository: string): GitHubIssueFilingSettings {
    return {
        repository,
    };
}

function isSettingsValid(data: GitHubIssueFilingSettings): boolean {
    return !isEmpty(data) && !isEmpty(data.repository) && isString(data.repository) && !isEmpty(data.repository.trim());
}

const settingsForm = NamedFC<SettingsFormProps<GitHubIssueFilingSettings>>('IssueFilingSettings', props => {
    const onGitHubRepositoryChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const propertyName: keyof GitHubIssueFilingSettings = 'repository';
        props.onPropertyUpdateCallback(GitHubIssueFilingServiceKey, propertyName, newValue);
    };

    return (
        <TextField
            className="issue-setting"
            label="Enter desired GitHub issues link:"
            onChange={onGitHubRepositoryChange}
            value={isEmpty(props.settings) ? '' : props.settings.repository}
            placeholder="https://github.com/owner/repo/issues"
        />
    );
});

const settingsGetter = createSettingsGetter<GitHubIssueFilingSettings>(GitHubIssueFilingServiceKey);

export const GitHubIssueFilingService: IssueFilingService<GitHubIssueFilingSettings> = {
    key: GitHubIssueFilingServiceKey,
    displayName: 'GitHub',
    settingsForm,
    buildStoreData,
    getSettingsFromStoreData: settingsGetter,
    isSettingsValid,
    fileIssue: createFileIssueHandler(gitHubIssueFilingUrlProvider, settingsGetter),
};
