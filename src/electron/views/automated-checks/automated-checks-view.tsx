// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { TitleBar, TitleBarProps } from 'electron/views/automated-checks/components/title-bar';
import { CommandBar, CommandBarProps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export type AutomatedChecksViewProps = CommandBarProps & TitleBarProps;

export const AutomatedChecksView = NamedFC<AutomatedChecksViewProps>('AutomatedChecksView', props => {
    return (
        <>
            <TitleBar deps={props.deps}></TitleBar>
            <CommandBar {...props} />
            <HeaderSection />
        </>
    );
});
