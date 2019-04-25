// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BugServiceProperties } from '../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../DetailsView/components/settings-panel/settings/settings-props';
import { BugFilingServiceProvider } from '../issue-filing-service-provider';
import { BugFilingService } from '../types/issue-filing-service';
import { BugFilingChoiceGroup } from './issue-filing-choice-group';

export type OnPropertyUpdateCallback = (bugService: string, propertyName: string, propertyValue: string) => void;
export type OnSelectedServiceChange = (service: string) => void;

export interface BugFilingSettingsContainerProps {
    deps: BugFilingSettingsContainerDeps;
    selectedBugFilingService: BugFilingService;
    selectedBugFilingServiceData: BugServiceProperties;
    onPropertyUpdateCallback: OnPropertyUpdateCallback;
    onSelectedServiceChange: OnSelectedServiceChange;
}

export type BugFilingSettingsContainerDeps = {
    bugFilingServiceProvider: BugFilingServiceProvider;
} & SettingsDeps;

export const BugFilingSettingsContainer = NamedSFC<BugFilingSettingsContainerProps>('BugFilingSettingsContainer', props => {
    const { deps, selectedBugFilingService, selectedBugFilingServiceData } = props;
    const SettingsForm = selectedBugFilingService.settingsForm;
    const bugFilingServices = deps.bugFilingServiceProvider.allVisible();

    return (
        <>
            <BugFilingChoiceGroup
                onSelectedServiceChange={props.onSelectedServiceChange}
                selectedBugFilingService={selectedBugFilingService}
                bugFilingServices={bugFilingServices}
            />
            <SettingsForm deps={deps} settings={selectedBugFilingServiceData} onPropertyUpdateCallback={props.onPropertyUpdateCallback} />
        </>
    );
});
