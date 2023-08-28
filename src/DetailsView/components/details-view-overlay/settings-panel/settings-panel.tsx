// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../../../actions/details-view-action-message-creator';
import { GenericPanel } from '../../generic-panel';
import { SettingsDeps } from './settings/settings-props';
import { SettingsComponent, SettingsProvider } from './settings/settings-provider';
import styles from './settings-panel.scss';

export type SettingsPanelDeps = SettingsDeps & {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    settingsProvider: SettingsProvider;
};

export interface SettingsPanelProps {
    deps: SettingsPanelDeps;
    userConfigStoreState: UserConfigurationStoreData;
    isOpen: boolean;
    featureFlagData: FeatureFlagStoreData;
    layerClassName?: string;
}

export const settingsPanelAutomationId = 'settings-panel';

export const SettingsPanel = NamedFC<SettingsPanelProps>('SettingsPanel', props => {
    const { deps, userConfigStoreState, featureFlagData, isOpen, layerClassName } = props;
    const { detailsViewActionMessageCreator, settingsProvider } = deps;

    return (
        <GenericPanel
            layerProps={{ className: layerClassName }}
            isOpen={isOpen}
            className={styles.settingsPanel}
            innerPanelAutomationId={settingsPanelAutomationId}
            onDismiss={detailsViewActionMessageCreator.closeSettingsPanel}
            closeButtonAriaLabel="Close settings panel"
            hasCloseButton={true}
            headerText="Settings"
        >
            {settingsProvider.all().map((TheComponent: SettingsComponent, index: number) => (
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
