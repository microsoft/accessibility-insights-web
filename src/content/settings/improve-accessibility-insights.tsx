// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NewTabLink } from '../../common/components/new-tab-link';
import { title } from '../strings/application';

export const telemetryPopupTitle = `We need your help`;

export const telemetryPopupCheckboxTitle = `I agree to enable telemetry`;

export const privacyStatementText = (
    <>
        Read our <NewTabLink href="http://go.microsoft.com/fwlink/?LinkId=521839"> privacy statement</NewTabLink> to learn more.
    </>
);

export const privacyStatementPopupText = <>You can change this choice anytime in settings. {privacyStatementText}</>;

export const enableTelemetrySettingsPanelTitle = `Help improve ${title}`;
