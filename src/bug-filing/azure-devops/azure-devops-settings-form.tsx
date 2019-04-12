// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption, TextField } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { SettingsFormProps } from '../types/settings-form-props';
import {
    AzureDevOpsBugFilingService,
    AzureDevOpsBugFilingSettings,
    AzureDevOpsIssueDetailLocation,
    AzureDevOpsIssueDetailLocationDropdownOption,
} from './azure-devops-bug-filing-service';

export const AzureDevOpsSettingsForm = NamedSFC<SettingsFormProps<AzureDevOpsBugFilingSettings>>('AzureDevOpsSettingsForm', props => {
    const options: AzureDevOpsIssueDetailLocationDropdownOption[] = [
        {
            key: 'reproSteps',
            text: 'Repro steps (default)',
        },
        {
            key: 'description',
            text: 'Description',
        },
    ];

    const onProjectURLChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const propertyName: keyof AzureDevOpsBugFilingSettings = 'projectURL';
        props.deps.userConfigMessageCreator.setBugServiceProperty(AzureDevOpsBugFilingService.key, propertyName, newValue);
    };

    const onIssueDetailLocationChange = (event: React.FormEvent<HTMLElement>, newValue?: IDropdownOption) => {
        const propertyName: keyof AzureDevOpsBugFilingSettings = 'issueDetailsLocationField';
        props.deps.userConfigMessageCreator.setBugServiceProperty(
            AzureDevOpsBugFilingService.key,
            propertyName,
            newValue.key as AzureDevOpsIssueDetailLocation,
        );
    };

    return (
        <>
            <TextField
                className="issue-setting"
                label="Enter the desired Azure DevOps project link:"
                value={props.settings ? props.settings.projectURL : null}
                placeholder="https://dev.azure.com/org/project"
                onChange={onProjectURLChange}
            />
            <Dropdown
                options={options}
                label="File issue details in:"
                onChange={onIssueDetailLocationChange}
                selectedKey={props.settings ? props.settings.issueDetailsLocationField : null}
            />
        </>
    );
});
