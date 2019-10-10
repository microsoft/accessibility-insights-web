// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TitleBar, TitleBarDeps } from 'electron/views/automated-checks/components/title-bar';
import * as React from 'react';

import { CommandBar, CommandBarDeps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export type AutomatedChecksViewDeps = CommandBarDeps & TitleBarDeps;
export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
};

export class AutomatedChecksView extends React.Component<AutomatedChecksViewProps> {
    public render(): JSX.Element {
        return (
            <>
                <TitleBar deps={this.props.deps}></TitleBar>
                <CommandBar deps={this.props.deps} />
                <HeaderSection />
            </>
        );
    }
}
