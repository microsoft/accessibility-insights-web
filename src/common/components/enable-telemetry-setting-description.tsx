// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { privacyStatementText } from '../../content/settings/improve-accessibility-insights';
import { NamedFC } from '../react/named-fc';
import { LinkComponentDeps, TelemetryNotice } from './telemetry-notice';

export const EnableTelemetrySettingDescription = NamedFC<LinkComponentDeps>('EnableTelemetrySettingDescription', ({ LinkComponent }) => (
    <>
        <TelemetryNotice LinkComponent={LinkComponent} />
        {privacyStatementText}
    </>
));
