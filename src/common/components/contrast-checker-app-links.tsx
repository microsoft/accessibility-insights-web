// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { windowsProductName } from 'content/strings/application';
import * as React from 'react';
import { NamedSFC } from '../react/named-sfc';
import { NewTabLink } from './new-tab-link';

export const WindowsContrastCheckerAppLink = NamedSFC('WindowsContrastCheckerAppLink', () => (
    <NewTabLink href="https://go.microsoft.com/fwlink/?linkid=2075365">{windowsProductName}</NewTabLink>
));

export const MacContrastCheckerAppLink = NamedSFC('MacContrastCheckerAppLink', () => (
    <NewTabLink href="https://developer.paciellogroup.com/resources/contrastanalyser/">Colour Contrast Analyser</NewTabLink>
));
