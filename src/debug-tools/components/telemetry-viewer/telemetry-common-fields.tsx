// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DebugToolsTelemetryMessage } from 'debug-tools/controllers/telemetry-listener';
import * as React from 'react';
import styles from './telemetry-common-fields.scss';

export type TelemetryCommonFieldsProps = Pick<
    DebugToolsTelemetryMessage,
    'applicationBuild' | 'applicationName' | 'applicationVersion' | 'installationId'
>;

export const TelemetryCommonFields = NamedFC<TelemetryCommonFieldsProps>(
    'TelemetryCommonFields',
    ({ applicationBuild, applicationName, applicationVersion, installationId }) => (
        <div className={styles.container}>
            <strong>Build:</strong>
            <span>{applicationBuild}</span>
            <strong>Name:</strong>
            <span>{applicationName}</span>
            <strong>Version:</strong>
            <span>{applicationVersion}</span>
            <strong>Installation Id:</strong>
            <span>{installationId}</span>
        </div>
    ),
);
