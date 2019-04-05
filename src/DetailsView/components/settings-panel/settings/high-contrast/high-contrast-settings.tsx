// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { enableHighContrastSettingsTitle, highContrastSettingsDescription } from '../../../../../content/settings/high-contrast-mode';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../setting';

export type HighContrastSettingsDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
};

export type HighContrastSettingsProps = SettingsProps<HighContrastSettingsDeps>;

export const HighContrastSettings = NamedSFC<HighContrastSettingsProps>('HighContrastSettings', props => {
    const { deps } = props;
    const { userConfigMessageCreator } = deps;

    return (
        <GenericToggle
            enabled={props.userConfigigurationStoreSate.enableHighContrast}
            id="enable-high-contrast-mode"
            name={enableHighContrastSettingsTitle}
            description={highContrastSettingsDescription}
            onClick={(id, state) => userConfigMessageCreator.setHighContrastMode(state)}
        />
    );
});
