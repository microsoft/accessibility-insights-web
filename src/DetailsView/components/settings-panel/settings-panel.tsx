// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { GenericPanel } from '../generic-panel';
import { SettingsDeps } from './settings/settings-props';
import { SettingsProviderImpl } from './settings/settings-provider-impl';
import { SettingsComponent } from './settings/settings-provider';

export type SettingsPanelDeps = SettingsDeps & {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
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
            {SettingsProviderImpl.all().map((TheComponent: SettingsComponent, index: number) => (
                <TheComponent
                    key={`settings-${index}`}
                    deps={deps}
                    featureFlagData={featureFlagData}
                    userConfigurationStoreState={userConfigStoreState}
                />
            ))}
        </GenericPanel>
    );
});
