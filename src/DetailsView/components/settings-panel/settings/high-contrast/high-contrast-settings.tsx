// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { enableHighContrastSettingsTitle, highContrastSettingsDescription } from 'content/settings/high-contrast-mode';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export const HighContrastSettings = NamedSFC<SettingsProps>('HighContrastSettings', props => {
    const { deps } = props;
    const { userConfigMessageCreator } = deps;

    return (
        <GenericToggle
            enabled={props.userConfigurationStoreState.enableHighContrast}
            id="enable-high-contrast-mode"
            name={enableHighContrastSettingsTitle}
            description={highContrastSettingsDescription}
            onClick={(id, state) => userConfigMessageCreator.setHighContrastMode(state)}
        />
    );
});
