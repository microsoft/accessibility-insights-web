// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { CommandBar, CommandBarProps } from './command-bar';
import { HeaderSection } from './header-section';

export type AutomatedChecksViewProps = CommandBarProps;

export const AutomatedChecksView = NamedFC<AutomatedChecksViewProps>('AutomatedChecksView', props => {
    return (
        <>
            <CommandBar {...props} />
            <HeaderSection />
        </>
    );
});
