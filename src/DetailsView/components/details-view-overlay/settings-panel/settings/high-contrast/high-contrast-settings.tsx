// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    enableHighContrastSettingsTitle,
    highContrastSettingsDescription,
} from 'content/settings/high-contrast-mode';
import * as React from 'react';
import { NamedFC } from '../../../../../../common/react/named-fc';
import { GenericToggle } from '../../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export const HighContrastSettings = NamedFC<SettingsProps>('HighContrastSettings', props => {
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
