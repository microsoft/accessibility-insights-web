// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    EnableTelemetrySettingDescription,
    enableTelemetrySettingsPanelTitle,
    LinkComponentDeps,
} from 'content/settings/improve-accessibility-insights';
import * as React from 'react';
import { NamedFC } from '../../../../../common/react/named-fc';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export type TelemetrySettingsProps = SettingsProps & {
    deps: LinkComponentDeps;
};

export const TelemetrySettings = NamedFC<TelemetrySettingsProps>('TelemetrySettings', props => {
    const { deps } = props;
    const { userConfigMessageCreator, LinkComponent } = deps;

    return (
        <GenericToggle
            enabled={props.userConfigurationStoreState.enableTelemetry}
            id="enable-telemetry"
            name={enableTelemetrySettingsPanelTitle}
            description={<EnableTelemetrySettingDescription LinkComponent={LinkComponent} />}
            onClick={(id, state) => userConfigMessageCreator.setTelemetryState(state)}
        />
    );
});
