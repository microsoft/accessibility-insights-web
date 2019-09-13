// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { privacyStatementText } from '../../content/settings/improve-accessibility-insights';
import { NamedFC } from '../react/named-fc';
import { LinkComponentType } from '../types/link-component-type';
import { TelemetryNotice } from './telemetry-notice';

export type EnableTelemetrySettingDescriptionDeps = {
    LinkComponent: LinkComponentType;
};

export type EnableTelemetrySettingDescriptionProps = {
    deps: EnableTelemetrySettingDescriptionDeps;
};

export const EnableTelemetrySettingDescription = NamedFC<EnableTelemetrySettingDescriptionProps>(
    'EnableTelemetrySettingDescription',
    props => (
        <>
            <TelemetryNotice deps={props.deps} />
            {privacyStatementText}
        </>
    ),
);
