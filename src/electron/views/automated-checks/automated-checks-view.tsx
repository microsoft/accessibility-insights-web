// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TitleBar, TitleBarDeps } from 'electron/views/automated-checks/components/title-bar';
import * as React from 'react';

import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { Scanning } from 'electron/views/automated-checks/components/scanning';
import { CommandBar, CommandBarDeps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export type AutomatedChecksViewDeps = CommandBarDeps &
    TitleBarDeps & {
        scanActionCreator: ScanActionCreator;
    };

export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
    devicePort: number;
    scanStoreData: ScanStoreData;
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
                {this.renderScanning()}
            </>
        );
    }

    private renderScanning(): JSX.Element {
        if (this.props.scanStoreData.status !== ScanStatus.Scanning) {
            return null;
        }

        return <Scanning />;
    }
}
