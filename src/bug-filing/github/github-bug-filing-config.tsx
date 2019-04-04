// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BugFilingOption } from '../types/bug-filing-option';

export type GithubSettings = {
    issueTrackerPath: string;
};

export const GithubBugFilingOption: BugFilingOption<GithubSettings> = {
    key: 'github',
    displayName: 'github',
    baseUrl: 'https://github.com',
    renderSettings: () => {
        return <h1>Settings</h1>;
    },
    buildStoreData: (issueTrackerPath: string) => {
        return {
            issueTrackerPath,
        };
    },
    isSettingsValid: (data: GithubSettings) => {
        return !!data.issueTrackerPath.trim();
    },
    buildBugFilingUrl: (data: GithubSettings) => {
        return data.issueTrackerPath.trim();
    },
    params: [
        {
            key: 'issueTrackerPath',
            displayName: 'url',
            isRequired: true,
            renderField: (props: any) => {
                return <h1>url: {props.issueTrackerPath}</h1>;
            },
        },
    ],
};
