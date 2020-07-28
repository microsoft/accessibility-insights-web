// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Dropdown, IDropdownOption, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { SettingsFormProps } from '../../types/settings-form-props';
import {
    AzureBoardsIssueDetailLocationDropdownOption,
    AzureBoardsIssueFilingServiceKey,
} from './azure-boards-issue-filing-service';
import {
    AzureBoardsIssueDetailField,
    AzureBoardsIssueFilingSettings,
} from './azure-boards-issue-filing-settings';

export const AzureBoardsSettingsForm = NamedFC<SettingsFormProps<AzureBoardsIssueFilingSettings>>(
    'AzureBoardsSettingsForm',
    props => {
        const options: AzureBoardsIssueDetailLocationDropdownOption[] = [
            {
                key: 'reproSteps',
                text: 'Repro steps',
            },
            {
                key: 'description',
                text: 'Description',
            },
        ];

        const onProjectURLChange = (
            event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
            newValue?: string,
        ) => {
            const propertyName: keyof AzureBoardsIssueFilingSettings = 'projectURL';
            const payload = {
                issueFilingServiceName: AzureBoardsIssueFilingServiceKey,
                propertyName,
                propertyValue: newValue,
            };
            props.onPropertyUpdateCallback(payload);
        };

        const onIssueDetailLocationChange = (
            event: React.FormEvent<HTMLElement>,
            newValue: IDropdownOption,
        ) => {
            const propertyName: keyof AzureBoardsIssueFilingSettings = 'issueDetailsField';
            const payload = {
                issueFilingServiceName: AzureBoardsIssueFilingServiceKey,
                propertyName,
                propertyValue: newValue.key as AzureBoardsIssueDetailField,
            };
            props.onPropertyUpdateCallback(payload);
        };

        return (
            <>
                <TextField
                    className="issue-setting"
                    label="Enter your Azure Boards project URL"
                    value={props.settings ? props.settings.projectURL : ''}
                    placeholder="https://dev.azure.com/org/project"
                    onChange={onProjectURLChange}
                />
                <Dropdown
                    options={options}
                    placeholder="Select an option"
                    label="File issue details in:"
                    onChange={onIssueDetailLocationChange}
                    selectedKey={props.settings ? props.settings.issueDetailsField : null}
                />
            </>
        );
    },
);
