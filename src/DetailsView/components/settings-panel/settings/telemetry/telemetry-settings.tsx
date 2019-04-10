// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import {
    enableTelemetrySettingDescription,
    enableTelemetrySettingsPanelTitle,
} from '../../../../../content/settings/improve-accessibility-insights';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export const TelemetrySettings = NamedSFC<SettingsProps>('TelemetrySettings', props => {
    const { deps } = props;
    const { userConfigMessageCreator } = deps;

    return (
        <GenericToggle
            enabled={props.userConfigurationStoreData.enableTelemetry}
            id="enable-telemetry"
            name={enableTelemetrySettingsPanelTitle}
            description={enableTelemetrySettingDescription}
            onClick={(id, state) => userConfigMessageCreator.setTelemetryState(state)}
        />
    );
});
