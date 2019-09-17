// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import { PrivacyStatementText, PrivacyStatementTextDeps } from './privacy-statement-text';
import { TelemetryNotice, TelemetryNoticeDeps } from './telemetry-notice';

export type EnableTelemetrySettingDescriptionDeps = TelemetryNoticeDeps & PrivacyStatementTextDeps;

export type EnableTelemetrySettingDescriptionProps = {
    deps: EnableTelemetrySettingDescriptionDeps;
};

export const EnableTelemetrySettingDescription = NamedFC<EnableTelemetrySettingDescriptionProps>(
    'EnableTelemetrySettingDescription',
    props => (
        <>
            <TelemetryNotice deps={props.deps} />
            <PrivacyStatementText deps={props.deps} />
        </>
    ),
);
