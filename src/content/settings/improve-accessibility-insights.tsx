// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ILinkProps } from 'office-ui-fabric-react';
import * as React from 'react';
import { NewTabLink } from '../../common/components/new-tab-link';
import { NamedSFC } from '../../common/react/named-sfc';
import { title } from '../strings/application';

export const telemetryPopupTitle = `We need your help`;

export const telemetryPopupCheckboxTitle = `I agree to enable telemetry`;

export type LinkComponentDeps = {
    LinkComponent: React.FC<ILinkProps>;
};

export const TelemetryNotice = NamedSFC<LinkComponentDeps>('TelemetryNotice', ({ LinkComponent }) => (
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

const privacyStatementText = (
    <>
        Read our <NewTabLink href="http://go.microsoft.com/fwlink/?LinkId=521839"> privacy statement</NewTabLink> to learn more.
    </>
);

export const privacyStatementPopupText = <>You can change this choice anytime in settings. {privacyStatementText}</>;

export const enableTelemetrySettingDescription = (
    <>
        {TelemetryNotice}
        {privacyStatementText}
    </>
);

export const enableTelemetrySettingsPanelTitle = `Help improve ${title}`;
