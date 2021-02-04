// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { toolName } from 'content/strings/application';
import * as React from 'react';

export const ToolLink = NamedFC('ToolLink', () => (
    <NewTabLink
        className={'tool-name-link'}
        href="http://aka.ms/AccessibilityInsights"
        title={`Get more information and download ${toolName}`}
    >
        http://aka.ms/AccessibilityInsights
    </NewTabLink>
));
