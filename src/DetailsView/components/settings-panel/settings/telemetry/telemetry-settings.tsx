// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { enableTelemetrySettingDescription, enableTelemetrySettingsPanelTitle } from 'content/settings/improve-accessibility-insights';
import * as React from 'react';
import { NamedFC } from '../../../../../common/react/named-fc';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export const TelemetrySettings = NamedFC<SettingsProps>('TelemetrySettings', props => {
    const { deps } = props;
    const { userConfigMessageCreator } = deps;

    return (
        <GenericToggle
            enabled={props.userConfigurationStoreState.enableTelemetry}
            id="enable-telemetry"
            name={enableTelemetrySettingsPanelTitle}
            description={enableTelemetrySettingDescription}
            onClick={(id, state) => userConfigMessageCreator.setTelemetryState(state)}
        />
    );
});
