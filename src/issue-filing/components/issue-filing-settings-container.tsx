// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-sfc';
import { IssueFilingServiceProperties } from '../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../DetailsView/components/settings-panel/settings/settings-props';
import { IssueFilingServiceProvider } from '../issue-filing-service-provider';
import { IssueFilingService } from '../types/issue-filing-service';
import { IssueFilingChoiceGroup } from './issue-filing-choice-group';

export type OnPropertyUpdateCallback = (bugService: string, propertyName: string, propertyValue: string) => void;
export type OnSelectedServiceChange = (service: string) => void;

export interface IssueFilingSettingsContainerProps {
    deps: IssueFilingSettingsContainerDeps;
    selectedIssueFilingService: IssueFilingService;
    selectedIssueFilingServiceData: IssueFilingServiceProperties;
    onPropertyUpdateCallback: OnPropertyUpdateCallback;
    onSelectedServiceChange: OnSelectedServiceChange;
}

export type IssueFilingSettingsContainerDeps = {
    issueFilingServiceProvider: IssueFilingServiceProvider;
} & SettingsDeps;

export const IssueFilingSettingsContainer = NamedFC<IssueFilingSettingsContainerProps>('IssueFilingSettingsContainer', props => {
    const { deps, selectedIssueFilingService, selectedIssueFilingServiceData } = props;
    const SettingsForm = selectedIssueFilingService.settingsForm;
    const issueFilingServices = deps.issueFilingServiceProvider.allVisible();

    return (
        <>
            <IssueFilingChoiceGroup
                onSelectedServiceChange={props.onSelectedServiceChange}
                selectedIssueFilingService={selectedIssueFilingService}
                issueFilingServices={issueFilingServices}
            />
            <SettingsForm deps={deps} settings={selectedIssueFilingServiceData} onPropertyUpdateCallback={props.onPropertyUpdateCallback} />
        </>
    );
});
