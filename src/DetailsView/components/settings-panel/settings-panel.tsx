// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { UserConfigMessageCreator } from '../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { GenericPanel } from '../generic-panel';
import { BugFilingSettings } from './settings/bug-filing/bug-filing-settings';
import { HighContrastSettings } from './settings/high-contrast/high-contrast-settings';
import { TelemetrySettings, TelemetrySettingsDeps } from './settings/telemetry/telemetry-settings';

export type SettingsPanelDeps = TelemetrySettingsDeps & {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    userConfigMessageCreator: UserConfigMessageCreator;
};

export interface SettingsPanelProps {
    deps: SettingsPanelDeps;
    userConfigStoreState: UserConfigurationStoreData;
    isOpen: boolean;
    featureFlagData: FeatureFlagStoreData;
}

export const SettingsPanel = NamedSFC<SettingsPanelProps>('SettingsPanel', props => {
    const { deps, userConfigStoreState, featureFlagData, isOpen } = props;

    return (
        <GenericPanel
            isOpen={isOpen}
            className="settings-panel"
            onDismiss={deps.detailsViewActionMessageCreator.closeSettingsPanel}
            closeButtonAriaLabel="Close settings panel"
            hasCloseButton={true}
            title="Settings"
        >
            <TelemetrySettings deps={deps} featureFlagData={featureFlagData} userConfigurationStoreState={userConfigStoreState} />
            <HighContrastSettings deps={deps} featureFlagData={featureFlagData} userConfigurationStoreState={userConfigStoreState} />
            <BugFilingSettings deps={deps} featureFlagData={featureFlagData} userConfigurationStoreState={userConfigStoreState} />
        </GenericPanel>
    );
});
