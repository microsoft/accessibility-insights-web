// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import { LinkComponentType } from '../types/link-component-type';

export type TelemetryNoticeDeps = {
    LinkComponent: LinkComponentType;
};

export type TelemetryNoticeProps = {
    deps: TelemetryNoticeDeps;
};

export const TelemetryNotice = NamedFC<TelemetryNoticeProps>('TelemetryNotice', props => (
    <>
        <p>
            By opting into telemetry, you{' '}
            <props.deps.LinkComponent href="https://accessibilityinsights.io/docs/en/telemetry">
                help the community
            </props.deps.LinkComponent>{' '}
            develop inclusive software.
        </p>
        <p>
            We collect anonymized data to identify the top accessibility issues found by the users.
            This will help focus the accessibility tools and standards community to improve
            guidelines, rules engines, and features.
        </p>
    </>
));
