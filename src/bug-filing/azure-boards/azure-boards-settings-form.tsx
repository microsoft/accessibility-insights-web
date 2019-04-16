// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption, TextField } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { SettingsFormProps } from '../types/settings-form-props';
import {
    AzureBoardsBugFilingService,
    AzureBoardsBugFilingSettings,
    AzureBoardsIssueDetailField,
    AzureBoardsIssueDetailLocationDropdownOption,
} from './azure-boards-bug-filing-service';

export const AzureBoardsSettingsForm = NamedSFC<SettingsFormProps<AzureBoardsBugFilingSettings>>('AzureBoardsSettingsForm', props => {
    const defaultKey = 'reproSteps';
    const options: AzureBoardsIssueDetailLocationDropdownOption[] = [
        {
            key: defaultKey,
            text: 'Repro steps (default)',
        },
        {
            key: 'description',
            text: 'Description',
        },
    ];

    const onProjectURLChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const propertyName: keyof AzureBoardsBugFilingSettings = 'projectURL';
        props.deps.userConfigMessageCreator.setBugServiceProperty(AzureBoardsBugFilingService.key, propertyName, newValue);
    };

    const onIssueDetailLocationChange = (event: React.FormEvent<HTMLElement>, newValue: IDropdownOption) => {
        const propertyName: keyof AzureBoardsBugFilingSettings = 'issueDetailsField';
        props.deps.userConfigMessageCreator.setBugServiceProperty(
            AzureBoardsBugFilingService.key,
            propertyName,
            newValue.key as AzureBoardsIssueDetailField,
        );
    };

    return (
        <>
            <TextField
                className="issue-setting"
                label="Enter the desired Azure Boards project link:"
                value={props.settings ? props.settings.projectURL : null}
                placeholder="https://dev.azure.com/org/project"
                onChange={onProjectURLChange}
            />
            <Dropdown
                options={options}
                label="File issue details in:"
                onChange={onIssueDetailLocationChange}
                selectedKey={props.settings ? props.settings.issueDetailsField : defaultKey}
            />
        </>
    );
});
