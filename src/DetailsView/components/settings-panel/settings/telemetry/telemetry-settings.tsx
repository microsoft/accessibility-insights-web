// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    EnableTelemetrySettingDescription,
    EnableTelemetrySettingDescriptionProps,
} from 'common/components/enable-telemetry-setting-description';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { GenericToggle } from '../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export type TelemetrySettingsProps = SettingsProps & EnableTelemetrySettingDescriptionProps;

export const createTelemetrySettings = (productName: string) => {
    return NamedFC<TelemetrySettingsProps>('TelemetrySettings', props => {
        const { deps } = props;
        const { userConfigMessageCreator } = deps;

        return (
            <GenericToggle
                enabled={props.userConfigurationStoreState.enableTelemetry}
                id="enable-telemetry"
                name={`Help improve ${productName}`}
                description={<EnableTelemetrySettingDescription deps={deps} />}
                onClick={(id, state) => userConfigMessageCreator.setTelemetryState(state)}
            />
        );
    });
};
