// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BugServiceProperties, UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../DetailsView/components/settings-panel/settings/settings-props';
import { BugFilingService } from '../types/bug-filing-service';
import { BugFilingChoiceGroup, BugFilingChoiceGroupDeps } from './bug-filing-choice-group';

export interface BugFilingSettingsContainerProps {
    deps: BugFilingSettingsContainerDeps;
    selectedBugFilingService: BugFilingService;
    bugFilingServices: BugFilingService[];
    userConfigurationStoreData: UserConfigurationStoreData;
    selectedBugFilingServiceData: BugServiceProperties;
}

export type BugFilingSettingsContainerDeps = BugFilingChoiceGroupDeps & SettingsDeps;

export const BugFilingSettingsContainer = NamedSFC<BugFilingSettingsContainerProps>('BugFilingSettingsContainer', props => {
    const { deps, bugFilingServices, selectedBugFilingService, userConfigurationStoreData, selectedBugFilingServiceData } = props;
    const SettingsForm = selectedBugFilingService.renderSettingsForm;

    return (
        <>
            <BugFilingChoiceGroup
                deps={deps}
                userConfigurationStoreData={userConfigurationStoreData}
                bugFilingServices={bugFilingServices}
            />
            <SettingsForm deps={deps} settings={selectedBugFilingServiceData} />
        </>
    );
});
