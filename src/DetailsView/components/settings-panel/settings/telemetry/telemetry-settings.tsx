// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import {
    enableTelemetrySettingDescription,
    enableTelemetrySettingsPanelTitle,
} from '../../../../../content/settings/improve-accessibility-insights';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../setting';

export type TelemetrySettingsDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
};
export type TelemetrySettingsProps = SettingsProps<TelemetrySettingsDeps>;
export const TelemetrySettings = NamedSFC<TelemetrySettingsProps>('TelemetrySettings', props => {
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
