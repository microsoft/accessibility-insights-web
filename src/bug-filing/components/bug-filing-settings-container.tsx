// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BugServiceProperties } from '../../common/types/store-data/user-configuration-store';
import { SettingsDeps } from '../../DetailsView/components/settings-panel/settings/settings-props';
import { BugFilingService } from '../types/bug-filing-service';
import { BugFilingChoiceGroup, BugFilingChoiceGroupDeps } from './bug-filing-choice-group';

export interface BugFilingSettingsContainerProps {
    deps: BugFilingSettingsContainerDeps;
    selectedBugFilingService: BugFilingService;
    bugFilingServices: BugFilingService[];
    selectedBugFilingServiceData: BugServiceProperties;
}

export type BugFilingSettingsContainerDeps = BugFilingChoiceGroupDeps & SettingsDeps;

export const BugFilingSettingsContainer = NamedSFC<BugFilingSettingsContainerProps>('BugFilingSettingsContainer', props => {
    const { deps, bugFilingServices, selectedBugFilingService, selectedBugFilingServiceData } = props;
    const SettingsForm = selectedBugFilingService.renderSettingsForm;

    return (
        <>
            <BugFilingChoiceGroup deps={deps} selectedBugFilingService={selectedBugFilingService} bugFilingServices={bugFilingServices} />
            <SettingsForm deps={deps} settings={selectedBugFilingServiceData} />
        </>
    );
});
