// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { GenericToggle } from '../../../generic-toggle';
import {
    enableTelemetrySettingDescription,
    enableTelemetrySettingsPanelTitle,
} from '../../../../../content/settings/improve-accessibility-insights';

export type TelemetrySettingsDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
};

export type TelemetrySettingsProps = {
    deps: TelemetrySettingsDeps;
    enabled: boolean;
};

export const TelemetrySettings = NamedSFC<TelemetrySettingsProps>('TelemetrySettings', props => {
    const { deps } = props;
    const { userConfigMessageCreator } = deps;

    return (
        <GenericToggle
            enabled={props.enabled}
            id="enable-telemetry"
            name={enableTelemetrySettingsPanelTitle}
            description={enableTelemetrySettingDescription}
            onClick={(id, state) => userConfigMessageCreator.setTelemetryState(state)}
        />
    );
});
