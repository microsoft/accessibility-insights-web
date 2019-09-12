// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ILinkProps } from 'office-ui-fabric-react';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';

export type LinkComponentDeps = {
    LinkComponent: React.FC<ILinkProps>;
};

export const TelemetryNotice = NamedFC<LinkComponentDeps>('TelemetryNotice', ({ LinkComponent }) => (
    <>
        <p>
            By opting into telemetry, you{' '}
            <LinkComponent href="https://accessibilityinsights.io/docs/en/telemetry">help the community</LinkComponent> develop inclusive
            software.
        </p>
        <p>
            We collect anonymized data to identify the top accessibility issues found by the users. This will help focus the accessibility
            tools and standards community to improve guidelines, rules engines, and features.
        </p>
    </>
));
