// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { androidAppTitle } from 'content/strings/application';
import * as React from 'react';
import { HeaderBar } from 'reports/components/header-bar';

export const UnifiedHeaderSection = NamedFC('UnifiedHeaderSection', () => {
    return (
        <header>
            <HeaderBar headerText={androidAppTitle} />
        </header>
    );
});
