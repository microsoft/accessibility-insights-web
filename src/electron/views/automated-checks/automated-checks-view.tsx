// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TitleBar, TitleBarDeps } from 'electron/views/automated-checks/components/title-bar';
import * as React from 'react';

import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { CommandBar, CommandBarDeps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export type AutomatedChecksViewDeps = CommandBarDeps &
    TitleBarDeps & {
        scanActionCreator: ScanActionCreator;
    };

export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
    devicePort: number;
};

export class AutomatedChecksView extends React.Component<AutomatedChecksViewProps> {
    public componentDidMount(): void {
        this.props.deps.scanActionCreator.scan(this.props.devicePort);
    }

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
