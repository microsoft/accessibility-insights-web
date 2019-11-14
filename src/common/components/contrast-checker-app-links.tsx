// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { windowsProductName } from 'content/strings/application';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import { NewTabLink } from './new-tab-link';

export const WindowsContrastCheckerAppLink = NamedFC(
    'WindowsContrastCheckerAppLink',
    () => (
        <NewTabLink href="https://go.microsoft.com/fwlink/?linkid=2075365">
            {windowsProductName}
        </NewTabLink>
    ),
);

export const MacContrastCheckerAppLink = NamedFC(
    'MacContrastCheckerAppLink',
    () => (
        <NewTabLink href="https://developer.paciellogroup.com/resources/contrastanalyser/">
            Colour Contrast Analyser
        </NewTabLink>
    ),
);
